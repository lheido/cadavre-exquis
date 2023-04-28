import { Route, Routes } from "@solidjs/router";
import type { Component } from "solid-js";
import Home from "./pages/Home";
import Room from "./pages/Room";

// import { Peer } from "peerjs";

// const peer = new Peer(`cadavre-exquis-${crypto.randomUUID()}`);

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={Home} />
      <Route path="/room/:id" component={Room} />
    </Routes>
  );
};

export default App;
