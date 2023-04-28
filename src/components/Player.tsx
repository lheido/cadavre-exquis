import { A } from "@solidjs/router";
import { Component, Match, Switch } from "solid-js";
import { usePlayerAPI } from "../features/api";
import { usePlayerGameState } from "../features/game";
import { usePeerPlayer } from "../features/peer";
import Game from "./Game";
import Icon from "./Icon";

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
        <header class="bg-primary rounded-b-3xl relative pt-32">
          <A
            href="/"
            class="absolute top-2 left-2 p-2 rounded-full flex justify-center items-center bg-transparent active:bg-neutral transition-colors"
          >
            <span class="sr-only">Quitter la partie</span>
            <Icon icon="close" class="w-5 h-5" />
          </A>
        </header>
      </Match>
      <Match when={game.started}>
        <Game game={gameState} api={api} peer={peer} />
      </Match>
    </Switch>
  );
};

export default Player;
