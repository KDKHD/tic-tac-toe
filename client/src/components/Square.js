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
    "max-width": "70%",
    "max-height": "70%",
  },
};

const getIcon = (state) => {
  switch (state) {
    case 0: {
      return <img src={o} alt="circle" style={styles.iconStyle} />;
      break;
    }
    case 1: {
      return <img src={x} alt="x" style={styles.iconStyle} />;
      break;
    }
    default: {
      return null;
    }
  }
};

function Square({ state, setSquare }) {
  return (
      <div style={styles.squareStyle} onClick={setSquare}>
        <div style={styles.content}>{getIcon(state)}</div>
      </div>
  );
}

export default Square;
