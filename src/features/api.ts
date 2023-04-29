import { useNavigate } from "@solidjs/router";
import { DataConnection } from "peerjs";
import { createEffect } from "solid-js";
import { produce } from "solid-js/store";
import { GameStateReturn } from "./game";
import { GameState, PeerAPI, PeerDataEvents, Step } from "./types";
import { User, useUser } from "./user";
import { buildFinalResult, removePeerIdPrefix } from "./utils";

export const useInitiatorAPI = (gameReturn: GameStateReturn) => {
  const [game, setGame] = gameReturn;

  createEffect(() => {
    if (game.started && !game.finished) {
      const playersSteps = Object.values(game.data);
      if (game.players.length === playersSteps.length) {
        const stepCompleted = playersSteps.every(
          (playerSteps) => playerSteps.length - 1 === game.step
        );
        if (stepCompleted && game.step + 1 <= game.steps.length - 1) {
          setGame("step", (i) => i + 1);
        }
        if (
          playersSteps.every(
            (playerSteps) => playerSteps.length === game.steps.length
          )
        ) {
          setGame(
            produce((s) => {
              s.finished = true;
              s.result = buildFinalResult(
                JSON.parse(JSON.stringify(game.data)),
                JSON.parse(JSON.stringify(game.steps))
              );
            })
          );
        }
      }
    }
  });

  return {
    onOpen: (co: DataConnection) => {
      co.send({ type: PeerDataEvents.InitiatorRequestUserData });
    },
    onClose: (co: DataConnection) => {
      if (!game.started) {
        // Remove the player from the game
        setGame(
          produce((s) => {
            const indexToRemove = s.players.findIndex(
              (p) => p.id === removePeerIdPrefix(co.peer)
            );
            if (indexToRemove !== -1) {
              s.players.splice(indexToRemove, 1);
            }
          })
        );
      } else {
        setGame(
          produce((s) => {
            const index = s.players.findIndex(
              (p) => p.id === removePeerIdPrefix(co.peer)
            );
            if (index !== -1) {
              s.players[index].connected = false;
            }
          })
        );
      }
    },
    data: {
      [PeerDataEvents.PlayerSendUserData]: (_, payload: User) => {
        let player = game.players.find((p) => p.id === payload.id);
        if (!player) {
          setGame(
            produce((s) => {
              s.players.push({ ...payload, connected: true });
            })
          );
        } else {
          setGame(
            produce((s) => {
              const index = s.players.findIndex((p) => p.id === payload.id);
              if (index !== -1) {
                s.players[index].connected = true;
              }
            })
          );
        }
      },
      [PeerDataEvents.InitiatorReceivePlayerUpdate]: (co, payload: Step) => {
        setGame(
          produce((s) => {
            if (s.data[payload.player] === undefined) {
              s.data[payload.player] = [];
            }
            s.data[payload.player].push(JSON.parse(JSON.stringify(payload)));
          })
        );
      },
    },
    send: <T>(event: PeerDataEvents, payload: T, co: DataConnection) => {
      co.send({ type: event, payload });
    },
    addStep: (step) => {
      setGame(
        produce((s) => {
          if (s.data[step.player] === undefined) {
            s.data[step.player] = [];
          }
          s.data[step.player]?.push(JSON.parse(JSON.stringify(step)));
        })
      );
    },
  } satisfies PeerAPI;
};

export const usePlayerAPI = (gameReturn: GameStateReturn) => {
  const [game, setGame] = gameReturn;
  const [user] = useUser();
  const navigate = useNavigate();
  return {
    data: {
      [PeerDataEvents.InitiatorRequestUserData]: (co) => {
        co.send({
          type: PeerDataEvents.PlayerSendUserData,
          payload: JSON.parse(JSON.stringify(user)),
        });
      },
      [PeerDataEvents.PlayerReceiveGameState]: (_, payload: GameState) => {
        setGame(payload);
      },
      [PeerDataEvents.InitiatorCloseRoom]: () => {
        localStorage.removeItem("game");
        navigate("/");
      },
    },
    send: <T>(event: PeerDataEvents, payload: T, co: DataConnection) => {
      co.send({ type: event, payload });
    },
    addStep: (step, co) => {
      co?.send({
        type: PeerDataEvents.InitiatorReceivePlayerUpdate,
        payload: step,
      });
    },
  } satisfies PeerAPI;
};
