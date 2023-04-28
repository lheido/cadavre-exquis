import { createEffect } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { GameState } from "./types";
import { useUser } from "./user";

export type GameStateReturn = [
  get: GameState,
  set: SetStoreFunction<GameState>
];

const initialStateJSON = localStorage.getItem("game");
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
if (initialStateJSON) {
  initialState = JSON.parse(initialStateJSON);
}

export const createGame = (): GameStateReturn => {
  const [initiator] = useUser();
  const [state, setState] = createStore<GameState>({
    ...initialState,
    initiator: initiator.id,
    players:
      initialState.players.length > 0
        ? initialState.players
        : [{ ...initiator, connected: true }],
  });
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
