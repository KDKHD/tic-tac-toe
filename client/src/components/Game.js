import React, { Component } from "react";
import Grid from "./Grid";
import socketIO from "socket.io-client";
import { withSnackbar } from "notistack";
import * as loading from "react-loadingg";

const getLoaders = (obj) =>
  Object.getOwnPropertyNames(obj).filter(
    (item) => typeof obj[item] === "function"
  );
const loaders = getLoaders(loading);

const getLoader = () => {
  let TempLoader = loading[loaders[Math.floor(Math.random() * loaders.length)]];
  return (<TempLoader/>);
};

const loader = getLoader();

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
      turn: null,
      state: this.initialState(),
      moveCounter: 0,
      result: null,
      name: "",
      player: null,
      gameId: null,
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
        gameId: gameState._id,
      });
    });

    socket.on("player", (player) => {
      this.setState({ player });
    });

    socket.on("message", ({ message, variant }) => {
      this.props.enqueueSnackbar(message, { variant });
    });
  }

  setSquare = async (x, y) => {
    socket.emit("move", [x, y]);
  };

  render() {
    return (
      <div style={styles.container}>
        <div>
          <div style={{flexDirection: 'row'}}>
            <div>
              <h1 style={{ textAlign: "left" }}>
                {this.state.result === null
                  ? "Undecided"
                  : this.state.result === 0
                  ? "Draw"
                  : this.state.result === this.state.player._id
                  ? `You have won`
                  : `Opponent has won`}
              </h1>

              {this.state.result === null && (
                <h3
                  style={{
                    ...styles.h3,
                  }}
                >
                  {this.state.turn != null
                    ? this.state.player._id == this.state.turn
                      ? "Your turn"
                      : "Opponents turn"
                    : "Game hasn't started"}
                </h3>
              )}
            </div>
            
          </div>
          <Grid
            turn={this.state.turn}
            state={this.state.state}
            setSquare={this.setSquare}
            player1={this.state.player1}
            player2={this.state.player2}
          />
          {this.state.turn == null && loader}
          <h3 style={{...styles.h3, marginTop:20}}>{`Game ID: ${this.state.gameId}`}</h3>
        </div>
        <div style={{ height: 400, marginLeft: 40, padding: 10 }}>
          {/* <TextField
            id="outlined-basic"
            label={this.state.name != null ? "Name" : null}
            variant="outlined"
            value={this.state.name}
            onChange={({ target }) =>
              this.setState({ name: target.value, unsavedName: true })
            }
          />
          {this.state.unsavedName && (
            <Button
              variant="contained"
              color="default"
              startIcon={<CloudUploadIcon />}
              style={{ marginLeft: 10 }}
              onClick={() => {
                socket.emit("setName", this.state.name);
                this.setState({ unsavedName: false });
              }}
            >
              Save
            </Button>
          )} */}
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
    "justifyContent": "center",
    "alignItems": "center",
    height: "100vh",
  },
};

export default withSnackbar(Game);
