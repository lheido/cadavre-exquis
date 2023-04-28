import { A } from "@solidjs/router";
import { Component, For, Match, Switch, createEffect } from "solid-js";
import { useInitiatorAPI } from "../features/api";
import { createGame } from "../features/game";
import { usePeerInitiator } from "../features/peer";
import { PeerDataEvents } from "../features/types";
import { useUser } from "../features/user";
import Game from "./Game";
import Icon from "./Icon";

const Initiator: Component = () => {
  const gameState = createGame();
  const [game, setGame] = gameState;
  const api = useInitiatorAPI(gameState);
  const [peer] = usePeerInitiator(api);
  const [user] = useUser();
  createEffect(() => {
    peer.users.forEach((u) => {
      api.send(
        PeerDataEvents.PlayerReceiveGameState,
        JSON.parse(JSON.stringify(game)),
        u.connection
      );
    });
  });
  return (
    <Switch>
      <Match when={!game.started}>
        <header class="bg-primary text-primary-content rounded-b-3xl relative pt-32">
          <A
            href="/"
            class="absolute top-2 left-2 p-2 rounded-full flex justify-center items-center bg-transparent active:bg-neutral transition-colors"
          >
            <span class="sr-only">Quitter la partie</span>
            <Icon icon="close" class="w-5 h-5" />
          </A>
          <section class="py-4 flex flex-col gap-2 rounded-3xl">
            <h1 class="text-lg text-center px-4">Joueurs</h1>
            <ul class="px-4 flex flex-col gap-2">
              <For each={game.players}>
                {(player) => (
                  <li
                    class="px-6 py-3 rounded-3xl bg-neutral text-neutral-content flex items-center"
                    classList={{ "opacity-50": !player.connected }}
                  >
                    {player.name}
                  </li>
                )}
              </For>
            </ul>
          </section>
        </header>
        <main class="flex justify-center p-16">
          <button
            class="px-8 py-4 text-3xl flex justify-center items-center rounded-full bg-accent text-accent-content select-none disabled:opacity-50"
            disabled={game.players.length < 2}
            onClick={() => {
              setGame("started", true);
            }}
          >
            Jouer !
          </button>
        </main>
      </Match>
      <Match when={game.started}>
        <Game game={gameState} api={api} />
      </Match>
    </Switch>
  );
};

export default Initiator;
