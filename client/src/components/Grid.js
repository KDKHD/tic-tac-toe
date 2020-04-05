import React, { Component } from "react";
import Square from "./Square";
import HSeperator from "./HSeperator";
import VSeperator from "./VSeperator";

function Grid({state, setSquare}) {
    
  const square = (x, y) => {
    return (
      <div style={styles.rowStyle}>
        <Square state={state[y][x]} setSquare={() => setSquare(x, y)} />
      </div>
    );
  };

  const col = (colStates, y) => {
    let squares = colStates[y].map((i, x) => square(x, y));
    return (
      <div style={styles.colStyle}>
        {squares[0]}
        <HSeperator />
        {squares[1]}
        <HSeperator />
        {squares[2]}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {col(state, 0)}
        <VSeperator />
        {col(state, 1)}
        <VSeperator />
        {col(state, 2)}
      </div>
    </div>
  );
}


const styles = {
  colStyle: {
    width: 200,
  },
  rowStyle: {
    height: 200,
  },
  grid: {
    display: "flex",
    overflow: "hidden",
    height: "614px",
  },
};

export default Grid;
