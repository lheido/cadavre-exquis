import { useNavigate } from "@solidjs/router";
import { Component, Match, Switch, createEffect, createSignal } from "solid-js";
import { produce } from "solid-js/store";
import { useInitiatorAPI } from "../features/api";
import { createGame } from "../features/game";
import { usePeerInitiator } from "../features/peer";
import { PeerDataEvents } from "../features/types";
import Game from "./Game";
import Icon from "./Icon";
import PlayerList from "./PlayerList";
import Aside from "./layout/Aside";
import Main from "./layout/Main";

const Initiator: Component = () => {
  const gameState = createGame();
  const [game, setGame] = gameState;
  const api = useInitiatorAPI(gameState);
  const [peer] = usePeerInitiator(api);
  const navigate = useNavigate();
  createEffect(() => {
    peer.users.forEach((u) => {
      api.send(
        PeerDataEvents.PlayerReceiveGameState,
        JSON.parse(JSON.stringify(game)),
        u.connection
      );
    });
  });

  const [stopFun, setStopFun] = createSignal(false);
  createEffect(() => {
    if (stopFun()) {
      if (game.players.length > 1) {
        peer.users.forEach((u) => {
          api.send(PeerDataEvents.InitiatorCloseRoom, true, u.connection);
        });
      }
      if (game.players.length === 1) {
        localStorage.removeItem("game");
        navigate("/");
      }
    }
  });
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
          <button
            class="px-8 py-4 font-display text-5xl flex justify-center items-center rounded-full bg-accent text-accent-content scale-100 active:scale-105 disabled:opacity-50 transition-all"
            disabled={game.players.length < 2}
            onClick={() => {
              setGame(
                produce((s) => {
                  s.started = true;
                  s.finished = false;
                  s.result = {};
                  s.data = s.players.reduce(
                    (acc, p) => ({ ...acc, [p.id]: [] }),
                    {}
                  );
                  s.step = 0;
                })
              );
            }}
          >
            Jouer !
          </button>
          <button
            class="py-4 px-6 rounded-full flex justify-center relative overflow-hidden items-center gap-4 text-lg font-bold bg-transparent bg-alert text-alert-content scale-100 active:scale-105 transition-all"
            onClick={() => {
              setStopFun(true);
            }}
          >
            <Icon
              icon="skull-2"
              class="w-12 h-12 absolute top-1/2 -right-2 -translate-y-1/2 -rotate-[12deg] opacity-60 z-0"
            />
            <span class="relative">Stopper le fun</span>
          </button>
        </Aside>
      </Match>
      <Match when={game.started}>
        <Game game={gameState} api={api} />
      </Match>
    </Switch>
  );
};

export default Initiator;
