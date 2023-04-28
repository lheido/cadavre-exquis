import {
  Component,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { GameStateReturn } from "../features/game";
import { PlayerPeerState } from "../features/peer";
import { PeerAPI, StepDescription } from "../features/types";
import { useUser } from "../features/user";
import Icon from "./Icon";

interface GameProps {
  game: GameStateReturn;
  api: PeerAPI;
  peer?: PlayerPeerState;
}

const Game: Component<GameProps> = (props: GameProps) => {
  const [user] = useUser();
  const [game] = props.game;
  const [value, setValue] = createSignal("");
  const [stepSent, setStepSent] = createSignal(false);
  const [scrollY, setScrollY] = createSignal(0);
  const isGameFinished = createMemo(
    () =>
      game.started &&
      game.data[user.id] &&
      game.data[user.id].length === game.steps.length
  );
  const step = createMemo((prev?: StepDescription) => {
    const newStep = game.steps[game.step];
    if (prev && prev.id !== newStep.id) {
      setStepSent(false);
    }
    return newStep;
  });
  const playersPlayed = createMemo(() => {
    const currentStep = step()?.id;
    return Object.values(game.data).reduce((count, playerSteps) => {
      return count + (playerSteps.find((s) => s.id === currentStep) ? 1 : 0);
    }, 0);
  });
  const opacity0 = createMemo(
    () => scrollY() > (window.visualViewport?.height ?? window.innerHeight) / 16
  );

  // Handle virtual keyboard
  const [keyboardVisible, setKeyboardVisible] = createSignal(false);
  const visualViewportResizeHandler = () => {
    setKeyboardVisible(
      (window.visualViewport?.height ?? 0) < window.innerHeight - 100
    );
  };
  const scrollHandler = () => {
    setScrollY(window.scrollY);
  };
  onMount(() => {
    window.visualViewport?.addEventListener(
      "resize",
      visualViewportResizeHandler
    );
    window.addEventListener("scroll", scrollHandler);
  });

  onCleanup(() => {
    window.visualViewport?.removeEventListener(
      "resize",
      visualViewportResizeHandler
    );
    window.removeEventListener("scroll", scrollHandler);
  });

  const addStepHandler = () => {
    const id = step().id;
    const data = value();
    setValue("");
    document.getElementById("step-input")!.innerText = "";
    setStepSent(true);
    props.api.addStep(
      {
        player: user.id,
        id,
        data,
      },
      props.peer?.player?.connection
    );
  };

  return (
    <Switch>
      <Match when={!isGameFinished()}>
        <main>
          <section class="bg-primary text-primary-content rounded-b-3xl h-[90svh] relative flex flex-col justify-between overflow-x-hidden">
            <header class="relative">
              <h1
                class="mt-16 py-4 px-6 text-center font-display transition-all duration-200"
                classList={{
                  "text-5xl": !keyboardVisible(),
                  "text-3xl": keyboardVisible(),
                }}
              >
                {step().description}
              </h1>
              <div class="absolute top-6 right-6 flex items-center gap-4">
                <button>
                  <Icon icon="lamp" class="w-5 h-5" />
                </button>
                <p>{`${playersPlayed()}/${game.players.length}`}</p>
              </div>
            </header>
            <div
              class="self-center relative transition-all"
              classList={{
                "grayscale-0 h-[40vh] w-[40vh]": stepSent(),
                "grayscale h-0 w-full translate-x-10 opacity-40": !stepSent(),
                "opacity-5": keyboardVisible(),
              }}
            >
              <div
                class="absolute top-0 left-0 xs:-left-3 w-[40svh] h-auto aspect-square transition-all"
                classList={{
                  "-translate-x-1/2 -translate-y-3/4 rotate-[20deg] scale-110":
                    !stepSent(),
                  "-translate-x-0 -translate-y-0 rotate-0 scale-100":
                    stepSent(),
                }}
              >
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
                  classList={{
                    "animate-bounce-slow": stepSent(),
                  }}
                >
                  <use href="#symbol-logo-skull" />
                </svg>
              </div>
            </div>
            <div
              class="relative transition-all"
              classList={{
                "h-full": keyboardVisible(),
              }}
            >
              <div
                class="flex items-end gap-4 py-4 pr-2 w-full transition-opacity duration-500"
                classList={{
                  "opacity-0": opacity0(),
                  "pl-6": !stepSent(),
                  "pl-2": stepSent(),
                }}
              >
                <Show
                  when={!stepSent()}
                  fallback={
                    <p class="py-6 text-center w-full">
                      En attente des autres joureurs
                    </p>
                  }
                >
                  <div class="flex-1 relative after:absolute after:bottom-0 after:left-0 after:bg-neutral after:h-px after:w-full after:opacity-50 focus-within:after:opacity-100 focus-within:after:h-0.5 after:transition-all">
                    <div
                      id="step-input"
                      class="w-full h-auto overflow-y-auto min-h-[15vh] max-h-[32svh] bg-neutral bg-opacity-20 p-2 rounded-t-lg placeholder:text-primary-content placeholder:text-opacity-70 outline-none before:opacity-70"
                      contenteditable
                      // @ts-ignore
                      placeholder={step().placeholder}
                      onInput={(e) => setValue(e.currentTarget.innerText)}
                    />
                  </div>
                  <button
                    class="transition-all disabled:opacity-50 active:bg-neutral active:text-neutral-content bg-accent rounded-full p-4 flex justify-center items-center"
                    disabled={value() === "" || opacity0()}
                    onClick={addStepHandler}
                  >
                    <span class="sr-only">Envoyer</span>
                    <Icon icon="send" />
                  </button>
                </Show>
              </div>
            </div>
          </section>
          <section class="h-[42vh]">
            <p>Game settings and QRCode</p>
          </section>
        </main>
      </Match>
    </Switch>
  );
};

export default Game;
