import { Component, ComponentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

type AsideProps = ComponentProps<"aside">;

const Aside: Component<AsideProps> = (props: AsideProps) => {
  const [classes] = splitProps(props, ["class"]);
  return (
    <aside class={twMerge("p-4 sticky bottom-0 z-0", classes.class)}>
      {props.children}
    </aside>
  );
};

export default Aside;
