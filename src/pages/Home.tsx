import { A } from "@solidjs/router";
import { Component } from "solid-js";
import Join from "../components/Join";
import User from "../components/User";
import { useUser } from "../features/user";

const Home: Component = () => {
  const [user] = useUser();

  return (
    <>
      <header class="bg-primary rounded-b-3xl px-4 pb-4 pt-16 flex flex-col justify-between gap-8 h-[90svh] shadow-xl shadow-neutral relative z-10">
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
      </header>
      <main class="p-4 flex flex-col gap-8 items-center sticky bottom-0 z-0">
        <Join />
        <A
          class="bg-primary py-2 px-8 text-4xl font-display flex items-center rounded-full"
          href={`/room/${user.id}`}
        >
          Créer une partie
        </A>
      </main>
    </>
  );
};

export default Home;
