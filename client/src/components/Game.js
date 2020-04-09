import React, { Component } from "react";
import Grid from "./Grid";
import socketIO from "socket.io-client";
import { withSnackbar } from 'notistack';

const socket = socketIO("http://192.168.1.119:3000", {
  transports: ["websocket"],
  jsonp: false,
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: null,
      player2: null,
      turn: 0,
      state: this.initialState(),
      moveCounter: 0,
      result: null,
    };
  }

  initialState = () => {
    return [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ];
  };

  componentDidMount() {
    socket.connect();
    socket.emit("newPlayer", Math.floor(Math.random() * 100));

    socket.on("state", (gameState) => {
      console.log(gameState);
      if (gameState.error) return;
      this.setState({
        state: gameState._state,
        player1: gameState._player1,
        player2: gameState._player2,
        turn: gameState.turn._id,
        result: gameState._result,
      });
    });

    socket.on("err", ({ error, message }) => {
      this.props.enqueueSnackbar(message)
    });
  }

  setSquare = async (x, y) => {
    socket.emit("move", [x, y]);
  };

  render() {
    return (
      <div style={styles.container}>

        <div>
          {this.state.result === null && (
            <h3
              style={{
                ...styles.h3,
                ...(this.state.turn == -1
                  ? { color: "black" }
                  : this.state.turn
                  ? { color: "#27ae60" }
                  : { color: "#2980b9" }),
              }}
            >
              {this.state.turn}
            </h3>
          )}
          {this.state.result!==null && (
            <h3
              style={{
                ...styles.h3,
                ...(this.state.turn == -1
                  ? { color: "black" }
                  : this.state.turn
                  ? { color: "#27ae60" }
                  : { color: "#2980b9" }),
              }}
            >
              {this.state.result === 0?"Draw":`Player ${this.state.result} won the game`}
            </h3>
          )}
          <Grid
            turn={this.state.turn}
            state={this.state.state}
            setSquare={this.setSquare}
            player1={this.state.player1}
            player2={this.state.player2}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  h3: {
    textAlign: "left",
    "text-decoration": "underline",
  },
  container: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    height: "100vh",
  },
};

export default withSnackbar(Game);
