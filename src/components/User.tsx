import { Component, ComponentProps, For, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { colors, useUser } from "../features/user";

interface UserProps extends ComponentProps<"section"> {
  prefix?: string;
  suffix?: string;
}

const User: Component<UserProps> = (props: UserProps) => {
  const [classes] = splitProps(props, ["class"]);
  const [user, updateUserName, updateUserColor] = useUser();
  return (
    <section
      class={twMerge("flex flex-col justify-center gap-4 px-6", classes.class)}
    >
      <div class="flex items-center gap-2">
        <span>{props.prefix}</span>
        <div class="flex-1 form-field bg-neutral bg-opacity-20 rounded-lg">
          <label for="user-name" class="sr-only">
            Pseudo
          </label>
          <input
            type="text"
            id="user-name"
            name="name"
            class="w-full"
            value={user.name}
            onInput={(e) => {
              updateUserName(e.currentTarget.value);
            }}
          />
        </div>
        <span>{props.suffix}</span>
      </div>
      <div>
        <fieldset>
          <legend class="sr-only">Couleur d'écriture</legend>
          <div class="grid grid-cols-4 gap-x-4 gap-y-2">
            <For each={colors}>
              {(color) => (
                <label
                  class="relative rounded-full w-12 h-12 after:absolute after:rounded-full after:w-full after:h-full after:border-primary-content after:transition-all"
                  style={{ background: color }}
                  classList={{
                    "after:border-4": user.color === color,
                    "after:border-0": user.color !== color,
                  }}
                >
                  <input
                    class="sr-only"
                    type="radio"
                    name="color"
                    checked={color === user.color}
                    value={color}
                    onInput={(e) => {
                      updateUserColor(e.currentTarget.value);
                    }}
                  />
                </label>
              )}
            </For>
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default User;
