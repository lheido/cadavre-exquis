import { DataConnection } from "peerjs";
import { User } from "./user";

export enum PeerDataEvents {
  InitiatorRequestUserData = "initiator:request-user-data",
  InitiatorReceivePlayerUpdate = "initiator:receive-player-update",
  PlayerSendUserData = "player:send-user-data",
  PlayerReceiveGameState = "player:receive-game-state",
  InitiatorCloseRoom = "initiator:close-room",
}

export interface PeerAPI {
  onOpen?: (co: DataConnection) => void;
  onClose?: (co: DataConnection) => void;
  data: Record<string, (co: DataConnection, payload: any) => void>;
  send: <T>(
    event: PeerDataEvents,
    payload: T,
    connection: DataConnection
  ) => void;
  addStep: (step: Step, co?: DataConnection) => void;
}

export interface StepDescription {
  id: string;
  description: string;
  placeholder: string;
  help: {
    title: string;
    content: string;
    exemples: string[];
  };
}

export interface Step {
  id: string;
  player: string;
  color: string;
  data: string;
}

export interface Player extends User {
  connected: boolean;
}

export enum GameStates {
  Config = "config",
  Playing = "playing",
  Finished = "finished",
}

export interface GameState {
  initiator: string;
  players: Player[];
  data: Record<string, Step[]>;
  steps: StepDescription[];
  result: Record<string, Step[]>;
  state: GameStates;
  stopped: boolean;
  step: number;
}
