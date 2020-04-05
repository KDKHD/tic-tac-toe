import React, { Component } from "react";
import Grid from "./Grid";
import socketIO from "socket.io-client";

const socket = socketIO("http://192.168.1.119:3000", {
  transports: ["websocket"],
  jsonp: false,
});

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: "Alex",
      player2: "Ivan",
      turn: 0,
      state: this.initialState(),
      moveCounter: 0,
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
    socket.on("connect", () => {
      console.log("connected to socket server");
    });
    socket.on("state", (state) => this.setState(state));
  }

  setSquare = async (x, y) => {
    let state = this.state.state;
    if (state[y][x] == -1) {
      state[y][x] = this.state.turn;
      await this.setState({
        state,
        turn: this.state.moveCounter == 8 ? -1 : this.state.turn ? 0 : 1,
        moveCounter: this.state.moveCounter + 1,
      });
      socket.emit("state", this.state);
    }
  };

  render() {
    return (
      <div style={styles.container}>
        <div>
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
            {this.state.moveCounter == 9
              ? "Game over"
              : this.state.turn
              ? this.state.player1
              : this.state.player2}
          </h3>
          <Grid
            turn={this.state.turn}
            state={this.state.state}
            setSquare={this.setSquare}
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

export default Game;
