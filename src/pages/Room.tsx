import { useParams } from "@solidjs/router";
import { Component, Match, Switch } from "solid-js";
import Initiator from "../components/Initiator";
import Player from "../components/Player";
import { useUser } from "../features/user";

const Room: Component = () => {
  const params = useParams();
  const [user] = useUser();

  return (
    <main>
      <Switch>
        <Match when={user.id !== params.id}>
          <Player target={params.id} />
        </Match>
        <Match when={user.id === params.id}>
          <Initiator />
        </Match>
      </Switch>
    </main>
  );
};

export default Room;
