import { createEffect } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";
import { GameState } from "./types";
import { useUser } from "./user";

export type GameStateReturn = [
  get: GameState,
  set: SetStoreFunction<GameState>
];

let initialState = {
  initiator: "",
  players: [],
  data: {},
  step: 0,
  steps: [
    {
      id: "sujet",
      description: "Sujet",
      placeholder:
        "Ecris un sujet, faut que ça commence bien !\nSans vouloir te mettre la pression...",
    },
    {
      id: "verbe",
      description: "Verbe",
      placeholder: "C'est le moment de tout mettre en action !",
    },
    {
      id: "complement_lieu",
      description: "Complément de lieu",
      placeholder: "Et où se passe tout ça ?",
    },
    {
      id: "complement_temps",
      description: "Complément de temps",
      placeholder: `P'tite précision sur le "quand" ?`,
    },
  ],
  started: false,
  finished: false,
  result: {},
} satisfies GameState;

const initialStateJSON = localStorage.getItem("game");
let localState: GameState | undefined;
if (initialStateJSON) {
  localState = JSON.parse(initialStateJSON);
}

export const createGame = (): GameStateReturn => {
  const [user] = useUser();
  const takeIntoAccountLocalStorageValue = localState?.initiator === user.id;
  const [state, setState] = createStore<GameState>(
    takeIntoAccountLocalStorageValue && localState ? localState : initialState
  );
  if (state.players.length < 1) {
    setState(
      produce((s) => {
        s.players.push({ ...user, connected: true });
        s.initiator = user.id;
      })
    );
  }
  createEffect(() => {
    localStorage.setItem("game", JSON.stringify(state));
  });
  return [state, setState];
};

export const usePlayerGameState = (): GameStateReturn => {
  const [state, setState] = createStore<GameState>(initialState);
  createEffect(() => {
    localStorage.setItem("game", JSON.stringify(state));
  });
  return [state, setState];
};
