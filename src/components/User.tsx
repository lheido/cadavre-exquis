import { Component, ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useUser } from "../features/user";

interface UserProps extends ComponentProps<"section"> {
  prefix?: string;
  suffix?: string;
}

const User: Component<UserProps> = (props: UserProps) => {
  const [classes] = splitProps(props, ["class"]);
  const [user, updateUserName] = useUser();
  return (
    <section class={twMerge("flex justify-center", classes.class)}>
      <div class="flex items-center gap-2">
        <span>{props.prefix}</span>
        <div class="form-field">
          <label for="user-name" class="sr-only">
            Pseudo
          </label>
          <input
            type="text"
            id="user-name"
            name="name"
            value={user.name}
            onInput={(e) => {
              updateUserName(e.currentTarget.value);
            }}
          />
        </div>
        <span>{props.suffix}</span>
      </div>
    </section>
  );
};

export default User;
