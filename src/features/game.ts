import { createEffect } from "solid-js";
import { SetStoreFunction, createStore, produce } from "solid-js/store";
import { GameState, GameStates } from "./types";
import { useUser } from "./user";

export type GameStateReturn = [
  get: GameState,
  set: SetStoreFunction<GameState>
];

export const initialState = {
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
      help: {
        title: "Aide pour le sujet",
        content: "Un personnage connu ou private joke qui fait l'action.",
        exemples: [
          "Le père noël tout le temps bourré",
          "Snoopy le chien",
          "Timéo l'enfant mal aimé par sa mère",
        ],
      },
    },
    {
      id: "verbe",
      description: "Verbe",
      placeholder: "C'est le moment de tout mettre en action !",
      help: {
        title: "Aide pour le verbe",
        content: "Une action plus ou moins complexe plus ou moins saugrenue.",
        exemples: [
          "s'étrangle de rire",
          "fait pipi",
          "se délecte goulûment d'un vers de farine",
        ],
      },
    },
    {
      id: "complement_lieu",
      description: "Complément de lieu",
      placeholder: "Et où se passe tout ça ?",
      help: {
        title: "Aide pour le complément de lieu",
        content: "Une phrase qui précise où se déroule l'action.",
        exemples: [
          "dans un caniveau",
          "dans l'appartement de [nom de votre meilleur pote]",
          "au salon de l'automobile rustique",
        ],
      },
    },
    {
      id: "complement_temps",
      description: "Complément de temps",
      placeholder: `P'tite précision sur le "quand" ?`,
      help: {
        title: "Aide pour le complément de temps",
        content:
          "Une phrase amusante de chose qui se déroule en même temps, ou un commentaire surprenant.",
        exemples: [
          "et tout le monde s'en fiche visiblement",
          "alors que son père le dénigre",
          "pendant que spider man le regarde avec des jumelles",
        ],
      },
    },
  ],
  state: GameStates.Config,
  stopped: false,
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
