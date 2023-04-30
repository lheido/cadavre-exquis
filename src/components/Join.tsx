import { useNavigate } from "@solidjs/router";
import {
  Component,
  ComponentProps,
  Show,
  createSignal,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";
import QRCodeScanner from "./QRCodeScanner";

interface JoinProps extends ComponentProps<"section"> {
  // add props here
}

const Join: Component<JoinProps> = (props: JoinProps) => {
  let formRef!: HTMLFormElement;
  const [classes] = splitProps(props, ["class"]);
  const navigate = useNavigate();

  const [showDialog, displayDialog] = createSignal(false, {
    equals: () => false,
  });

  const navigateToExistingRoom = (e: Event) => {
    e.preventDefault();
    navigate(`/room/${formRef.room.value}`);
  };

  return (
    <section
      class={twMerge(
        "p-4 bg-accent text-accent-content rounded-3xl flex flex-col gap-8",
        classes.class
      )}
    >
      <h1 class="text-2xl text-center mt-4">Rejoindre une partie</h1>
      <form
        ref={formRef}
        class="flex"
        action=""
        onSubmit={navigateToExistingRoom}
        autocomplete="off"
      >
        <div class="form-field flex-1 bg-neutral bg-opacity-20 rounded-l-lg">
          <label for="join-room-by-id" class="sr-only">
            Via un identifiant
          </label>
          <input
            type="text"
            id="join-room-by-id"
            name="room"
            value="55b95a34-2adc-4b2b-80e1-31bd11713ae8"
            class="w-full text-neutral-content placeholder:text-neutral-content"
            placeholder="Tu connais l'id ?"
          />
        </div>
        <button
          type="submit"
          class="bg-neutral text-neutral-content rounded-r-lg px-3 py-2 flex items-center gap-2"
        >
          <span class="">Rejoindre</span>
          <Icon icon="enter" class="w-4 h-4" />
        </button>
      </form>

      <button
        class="bg-neutral text-neutral-content py-4 px-6 rounded-2xl flex items-center justify-between gap-2"
        onClick={() => {
          displayDialog(true);
        }}
      >
        <span>Scan un QRCode !</span>
        <Icon icon="qrcode" />
      </button>

      <Portal mount={document.body}>
        <Show when={showDialog()}>
          <dialog
            open
            onClose={() => {
              displayDialog(false);
            }}
            class="border-none z-50 w-[90vw] h-[90svh] bg-accent text-accent-content rounded-3xl fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
          >
            <div class="flex flex-col gap-8 h-full">
              <QRCodeScanner class="flex-1 rounded-2xl" />
              <button
                class="py-4 px-6 bg-neutral text-accent rounded-2xl flex items-center justify-between gap-2"
                onClick={() => {
                  displayDialog(false);
                }}
              >
                <span class="text-lg">Fermer</span>
                <Icon icon="close" />
              </button>
            </div>
          </dialog>
        </Show>
      </Portal>
    </section>
  );
};

export default Join;
