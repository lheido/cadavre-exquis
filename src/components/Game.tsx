import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";
import { GameStateReturn } from "../features/game";
import { PlayerPeerState } from "../features/peer";
import { GameStates, PeerAPI } from "../features/types";
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
  const [scrollY, setScrollY] = createSignal(0);

  const playing = createMemo(() => game.state === GameStates.Playing);
  const finished = createMemo(() => game.state === GameStates.Finished);
  const step = createMemo(() => game.steps[game.step]);
  const waitingForOthers = createMemo(
    () => playing() && !!game.data[user.id].find((s) => s.id === step().id)
  );

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
    props.api.addStep(
      {
        player: user.id,
        id,
        data,
        color: user.color,
      },
      props.peer?.player?.connection
    );
  };

  const finalResult = createMemo(
    () => (game.result && game?.result[user.id]) ?? []
  );

  const [showDialog, displayDialog] = createSignal(false);

  return (
    <Switch>
      <Match when={!finished()}>
        <section class="relative h-full flex flex-col justify-between overflow-x-hidden">
          <header class="relative">
            <h1
              class="mt-20 py-4 px-6 text-center font-display transition-all duration-200 supports-ios:text-3xl"
              classList={{
                "text-5xl": !keyboardVisible(),
                "text-3xl": keyboardVisible(),
              }}
            >
              {step().description}
            </h1>
            <div class="absolute top-6 right-0 px-6 w-full flex justify-between items-center gap-6">
              <button
                class="p-2 rounded-full"
                onClick={() => {
                  displayDialog(true);
                }}
              >
                <Icon icon="lamp" class="w-7 h-7" />
              </button>
              <Portal mount={document.body}>
                <Show when={showDialog()}>
                  <dialog
                    class="bg-neutral text-neutral-content w-[90%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg z-50"
                    open
                  >
                    <section class="p-4">
                      <header class="flex justify-between">
                        <h1 class="text-xl">{step().help.title}</h1>
                        <button
                          onClick={() => {
                            displayDialog(false);
                          }}
                        >
                          <span class="sr-only">Fermer</span>
                          <Icon icon="close" />
                        </button>
                      </header>
                      <div class="mt-16 flex flex-col gap-8">
                        <p>{step().help.content}</p>
                        <div>
                          <p>Exemples :</p>
                          <ul class="list-disc pl-8">
                            <For each={step().help.exemples}>
                              {(example) => <li>{example}</li>}
                            </For>
                          </ul>
                        </div>
                      </div>
                    </section>
                  </dialog>
                </Show>
              </Portal>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <Icon icon="skull" class="w-5 h-5" />
                  <p>{`${playersPlayed()}/${game.players.length}`}</p>
                </div>
                <div class="flex items-center gap-2">
                  <Icon icon="cupcake" class="w-5 h-5" />
                  <p>{`${game.step + 1}/${game.steps.length}`}</p>
                </div>
              </div>
            </div>
          </header>
          <div
            class="self-center relative transition-all supports-ios:opacity-5"
            classList={{
              "grayscale-0 h-[40vh] w-[40vh]": waitingForOthers(),
              "grayscale h-0 w-full translate-x-10 opacity-40":
                !waitingForOthers(),
              "opacity-5": keyboardVisible(),
            }}
          >
            <div
              class="absolute top-0 left-0 xs:-left-3 w-[40svh] h-auto aspect-square transition-all"
              classList={{
                "-translate-x-1/2 -translate-y-3/4 rotate-[20deg] scale-110":
                  !waitingForOthers(),
                "-translate-x-0 -translate-y-0 rotate-0 scale-100":
                  waitingForOthers(),
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
                  "animate-bounce-slow": waitingForOthers(),
                }}
              >
                <use href="#symbol-logo-skull" />
              </svg>
            </div>
          </div>
          <div
            class="relative supports-ios:h-full"
            classList={{
              "h-full": keyboardVisible(),
            }}
          >
            <div
              class="flex items-end gap-4 py-4 pr-2 w-full transition-opacity duration-500 !supports-ios:opacity-100"
              classList={{
                "opacity-0": opacity0(),
                "pl-4": !waitingForOthers(),
                "pl-2": waitingForOthers(),
              }}
            >
              <Show
                when={!waitingForOthers()}
                fallback={
                  <p class="py-6 text-center w-full">
                    En attente des autres joueurs
                  </p>
                }
              >
                <div class="flex-1 relative after:absolute after:bottom-0 after:right-0 after:bg-neutral after:h-px after:w-[93%] after:opacity-50 focus-within:after:opacity-100 focus-within:after:h-0.5 after:transition-all">
                  <div
                    id="step-input"
                    class="w-full h-auto overflow-y-auto min-h-[15vh] max-h-[32svh] bg-neutral bg-opacity-20 p-2 rounded-t-lg rounded-bl-2xl placeholder:text-primary-content placeholder:text-opacity-70 outline-none before:opacity-70"
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
      </Match>
      <Match when={finished()}>
        <section class="relative flex flex-col gap-8 overflow-x-hidden">
          <h1 class="text-center font-display text-5xl pt-16">C'est fini !</h1>
          <p class="text-center px-6">Voici un des résultats</p>
          <ul class="flex flex-col gap-2 px-6">
            <For each={finalResult()}>
              {(result) => (
                <li class="p-4 bg-neutral rounded-lg overflow-hidden relative">
                  {result.data}
                  <Icon
                    icon="skull"
                    class="w-12 h-12 absolute -top-3 -right-3 -rotate-12 opacity-50"
                    style={{ color: result.color }}
                  />
                </li>
              )}
            </For>
          </ul>
        </section>
      </Match>
    </Switch>
  );
};

export default Game;
