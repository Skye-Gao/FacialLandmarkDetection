import React, { useState, useCallback, useRef } from "react";
import produce from 'immer';


const numRows = 120;
const numCols = 160;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const Game= (props) => {
    // console.log("get face data from parent",props.facedata);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
 
  const facedataRef=useRef();
  facedataRef.current=props.facedata;

  const runSimulation = useCallback(() => {
    let points=facedataRef.current;

    setGrid(g => {
      return produce(g, gridCopy => {
        
        
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }

          }
        }
        if (points.length > 0) {
            points.forEach((point) => {
              let keypoints =point.scaledMesh;
            
              for (let i = 0; i < keypoints.length; i++) {
                const x = keypoints[i][0];
                const y = keypoints[i][1];
                const c=Math.floor(x/480*numCols);
                const r=Math.floor(y/640*numRows);
                console.log("column index is",c,"row index is",r);
                console.log("current grid is",gridCopy);
                if (gridCopy&&gridCopy[r]&&gridCopy[r][c]==0){
                gridCopy[r][c] = 1;
                }
              }
            });
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <button
        onClick={() => {
        runSimulation();
        }}
      ></button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 5px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              style={{
                width: 5,
                height: 5,
                backgroundColor: grid[i][k] ? "pink" :"white",
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Game;

