import Peer, { DataConnection } from "peerjs";
import { createEffect, onCleanup } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";
import { PeerAPI } from "./types";
import { useUser } from "./user";
import { getPeerId, removePeerIdPrefix } from "./utils";

export interface PlayerConnection {
  id: string;
  peerId: string;
  connection: DataConnection;
}

export interface BasePeerState {
  ready: boolean;
  instance: Peer;
  users: PlayerConnection[];
  player?: PlayerConnection;
}

export interface InitiatorPeerState extends Omit<BasePeerState, "player"> {
  users: PlayerConnection[];
}

export interface PlayerPeerState extends Omit<BasePeerState, "users"> {
  player: PlayerConnection | undefined;
  connected: boolean;
  atempts: number;
}

export type UsePeerReturn<T> = [T, SetStoreFunction<T>];

export interface PeerData<T = unknown> {
  type: string;
  payload: T;
}

export const usePeerPlayer = (
  target: string,
  api: PeerAPI
): UsePeerReturn<PlayerPeerState> => {
  let connection: DataConnection;
  const [user] = useUser();
  const peer = new Peer(getPeerId(user.id));
  const [state, setState] = createStore<PlayerPeerState>({
    ready: false,
    instance: peer,
    player: undefined,
    connected: false,
    atempts: 0,
  });
  peer.on("open", () => setState("ready", true));
  createEffect(() => {
    if (state.ready) {
      connection = state.instance.connect(getPeerId(target));
      connection.on("open", () => {
        setState(
          produce((s) => {
            s.player = {
              id: removePeerIdPrefix(s.instance.id),
              peerId: s.instance.id,
              connection,
            };
            s.connected = true;
          })
        );
      });
      if (api.data) {
        connection.on("data", (data: any) => {
          if ("type" in data) {
            if (api.data[data.type]) {
              api.data[data.type](connection, (data as PeerData).payload);
            }
          }
        });
      }
      connection.on("close", () => setState("connected", false));
      // TODO: take into account connection errors
      // connection.on("error", console.error);
    }
  });
  const maxReconnectAttempts = 3;
  let interval: number;
  createEffect((prev?: boolean) => {
    if (prev && !state.connected) {
      interval = setInterval(() => {
        if (state.atempts < maxReconnectAttempts) {
          setState("atempts", (s) => s + 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } else if (!prev && state.connected && state.atempts > 0) {
      setState("atempts", 0);
      console.log("reconnection successful");
      clearInterval(interval);
    }
    return state.connected;
  });
  createEffect((atempts?: number) => {
    if (state.atempts > 0 && atempts === state.atempts - 1) {
      console.log("trying to reconnect", state.atempts);
      // TODO: try to reconnect to the initiator.
    }
    return state.atempts;
  });
  onCleanup(() => {
    if (connection) {
      connection.close();
    }
    peer.disconnect();
    peer.destroy();
  });
  return [state, setState];
};

export const usePeerInitiator = (
  api: PeerAPI
): UsePeerReturn<InitiatorPeerState> => {
  const [user] = useUser();
  const peer = new Peer(getPeerId(user.id));
  const [state, setState] = createStore<InitiatorPeerState>({
    ready: false,
    instance: peer,
    users: [],
  });
  peer.on("open", () => setState("ready", true));
  createEffect(() => {
    if (state.ready) {
      state.instance.on("connection", (co) => {
        co.on("open", () => {
          setState(
            produce((s) => {
              if (!s.users.find((p) => p.peerId === co.peer)) {
                s.users.push({
                  id: removePeerIdPrefix(co.peer),
                  peerId: co.peer,
                  connection: co,
                });
              }
            })
          );
          if (api.onOpen) {
            api.onOpen(co);
          }
        });
        if (api.data) {
          co.on("data", (data: any) => {
            if ("type" in data && "payload" in data) {
              if (api.data[data.type]) {
                api.data[data.type](co, (data as PeerData).payload);
              }
            }
          });
        }
        // TODO: take into account connection errors
        // co.on("error", console.error);
        co.on("close", () => {
          setState(
            produce((s) => {
              const index = s.users.findIndex((p) => p.peerId === co.peer);
              if (index > -1) {
                s.users.splice(index, 1);
              }
            })
          );
          if (api.onClose) {
            api.onClose(co);
          }
        });
      });
      state.instance.on("error", console.error);
    }
  });
  onCleanup(() => {
    peer.disconnect();
    peer.destroy();
  });
  return [state, setState];
};
