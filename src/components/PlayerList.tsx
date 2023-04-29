import { Component, ComponentProps, For } from "solid-js";
import { Player } from "../features/types";
import { useUser } from "../features/user";

interface PlayerListProps extends ComponentProps<"section"> {
  players: Player[];
}

const PlayerList: Component<PlayerListProps> = (props: PlayerListProps) => {
  const [user] = useUser();
  return (
    <section class="py-4 flex flex-col gap-2 rounded-3xl">
      <h1 class="text-lg text-center px-4">Joueurs</h1>
      <ul class="px-4 flex flex-col gap-2">
        <For each={props.players}>
          {(player) => (
            <li
              class="px-6 py-3 rounded-3xl bg-neutral text-neutral-content flex items-center relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:border-2 before:rounded-3xl"
              classList={{
                "before:border-accent": player.id === user.id,
                "before:border-transparent": player.id !== user.id,
                "opacity-50": !player.connected,
              }}
            >
              {player.name}
            </li>
          )}
        </For>
      </ul>
    </section>
  );
};

export default PlayerList;
