import React from "react";
import logo from "./logo.svg";
import Game from "./components/Game";
import "./App.css";
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <Game />
      </div>
    </SnackbarProvider>
  );
}

export default App;
