import { useNavigate } from "@solidjs/router";
import { Component, ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

interface JoinProps extends ComponentProps<"section"> {
  // add props here
}

const Join: Component<JoinProps> = (props: JoinProps) => {
  let formRef!: HTMLFormElement;
  const navigate = useNavigate();

  const [classes] = splitProps(props, ["class"]);

  const navigateToExistingRoom = (e: Event) => {
    e.preventDefault();
    navigate(`/room/${formRef.room.value}`);
  };

  return (
    <section
      class={twMerge(
        "p-4 bg-accent text-accent-content rounded-lg",
        classes.class
      )}
    >
      <h1 class="text-xl">Rejoindre une partie</h1>
      <form
        ref={formRef}
        class="flex gap-4 items-center mt-4"
        action=""
        onSubmit={navigateToExistingRoom}
        autocomplete="off"
      >
        <div class="form-field flex-1">
          <label for="join-room-by-id" class="sr-only">
            Via un identifiant
          </label>
          <input
            type="text"
            id="join-room-by-id"
            name="room"
            value="55b95a34-2adc-4b2b-80e1-31bd11713ae8"
            class="w-full"
            placeholder="Tu connais l'id ?"
          />
        </div>
        <button
          type="submit"
          class="bg-neutral text-neutral-content rounded-lg px-3 py-2 flex items-center gap-2"
        >
          <span class="">Rejoindre</span>
          <Icon icon="enter" class="w-4 h-4" />
        </button>
      </form>
    </section>
  );
};

export default Join;
