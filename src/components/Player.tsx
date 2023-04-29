import { A } from "@solidjs/router";
import { Component, Match, Switch } from "solid-js";
import { usePlayerAPI } from "../features/api";
import { usePlayerGameState } from "../features/game";
import { usePeerPlayer } from "../features/peer";
import Game from "./Game";
import Icon from "./Icon";
import PlayerList from "./PlayerList";
import Aside from "./layout/Aside";
import Main from "./layout/Main";

interface PlayerProps {
  target: string;
}

const Player: Component<PlayerProps> = (props: PlayerProps) => {
  const gameState = usePlayerGameState();
  const [game] = gameState;
  const api = usePlayerAPI(gameState);
  const [peer] = usePeerPlayer(props.target, api);
  return (
    <Switch>
      <Match when={!game.started}>
        <Main>
          <div class="absolute z-0 -bottom-[5vh] -left-3 -translate-x-1/3 rotate-[20deg] grayscale opacity-20 w-[60svh] h-auto aspect-square transition-all">
            <svg class="absolute w-full h-full top-0 left-0">
              <use href="#symbol-logo-cup" />
            </svg>
            <svg class="absolute w-full h-full top-0 left-0">
              <use href="#symbol-logo-cake" />
            </svg>
            <svg class="absolute w-full h-full top-0 left-0">
              <use href="#symbol-logo-cherry" />
            </svg>
            <svg
              class="absolute w-full h-full top-0 left-0"
              style={{ "transform-origin": "62% 52%" }}
            >
              <use href="#symbol-logo-skull" />
            </svg>
          </div>
          <PlayerList players={game.players} />
        </Main>
        <Aside class="flex flex-col justify-center gap-8 p-16">
          <A
            href="/"
            class="py-4 px-6 rounded-full flex justify-center items-center gap-4 bg-transparent border border-primary active:bg-primary active:text-primary-content transition-colors"
          >
            <span>Quitter la partie</span>
            <Icon icon="close" class="w-5 h-5" />
          </A>
        </Aside>
      </Match>
      <Match when={game.started}>
        <Game game={gameState} api={api} peer={peer} />
      </Match>
    </Switch>
  );
};

export default Player;
