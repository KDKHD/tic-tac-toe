import React, { Component } from "react";
import x from "../assets/x.png";
import o from "../assets/o.png";

const styles = {
  squareStyle: {
    height: "100%",
    width: "100%",
    // backgroundColor: "red",
  },
  content: {
    display: "flex",
    "justify-content": "center",
    "align-items": "center",
    height: "200px",
  },
  iconStyle: {
    "maxWidth": "70%",
    "maxHeight": "70%",
  },
};

const getIcon = (state, player1, player2) => {
  if(player1===null || player2 === null) return null
  switch (state) {
    case player1._id: {
      return <img src={o} alt="circle" style={styles.iconStyle} />;
      break;
    }
    case player2._id: {
      return <img src={x} alt="x" style={styles.iconStyle} />;
      break;
    }
    default: {
      return null;
    }
  }
};

function Square({ state, setSquare, player1, player2 }) {
  return (
      <div style={styles.squareStyle} onClick={setSquare}>
        <div style={styles.content}>{getIcon(state, player1, player2)}</div>
      </div>
  );
}

export default Square;
