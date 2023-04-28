import { A } from "@solidjs/router";
import { Component } from "solid-js";
import Join from "../components/Join";
import User from "../components/User";
import Aside from "../components/layout/Aside";
import Main from "../components/layout/Main";
import { useUser } from "../features/user";

const Home: Component = () => {
  const [user] = useUser();

  return (
    <>
      <Main class="flex flex-col justify-between gap-8 pt-16">
        <h1 class="text-5xl text-center font-display">Cadavre Exquis</h1>

        <div class="w-80 h-80 relative m-auto">
          <svg class="absolute w-80 h-80 top-0 left-0">
            <use href="#symbol-logo-cup" />
          </svg>
          <svg class="absolute w-80 h-80 top-0 left-0">
            <use href="#symbol-logo-cake" />
          </svg>
          <svg class="absolute w-80 h-80 top-0 left-0">
            <use href="#symbol-logo-cherry" />
          </svg>
          <svg class="absolute w-80 h-80 top-0 left-0">
            <use href="#symbol-logo-skull" />
          </svg>
        </div>

        <User prefix="Hello" suffix="!" />
      </Main>
      <Aside class="flex flex-col gap-8 items-center">
        <Join />
        <A
          class="bg-primary py-2 px-8 text-4xl font-display flex items-center rounded-full"
          href={`/room/${user.id}`}
        >
          Créer une partie
        </A>
      </Aside>
    </>
  );
};

export default Home;
