import { Component, ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

type MainProps = ComponentProps<"main">;

const Main: Component<MainProps> = (props: MainProps) => {
  const [classes] = splitProps(props, ["class"]);
  return (
    <main
      class={twMerge(
        "bg-primary text-primary-content relative pt-32 rounded-b-3xl px-4 pb-4 h-[90svh] shadow-xl overflow-hidden shadow-neutral z-10",
        classes.class
      )}
    >
      {props.children}
    </main>
  );
};

export default Main;
