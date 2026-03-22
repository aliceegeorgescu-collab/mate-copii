import { rand } from "./random";

export const MAZE_SETTINGS = {
  usor: { size: 5, time: 90, penaltyWalls: 3, maxScore: 950 },
  mediu: { size: 7, time: 60, penaltyWalls: 7, maxScore: 650 },
  greu: { size: 9, time: 45, penaltyWalls: 11, maxScore: 500 },
};

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function buildMaze(size, extraRemovals = 0) {
  const maze = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const stack = [{ row: 0, col: 0 }];
  maze[0][0].visited = true;
  const directions = [
    { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    { dr: 0, dc: 1, wall: "right", opposite: "left" },
    { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    { dr: 0, dc: -1, wall: "left", opposite: "right" },
  ];

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = directions.filter((direction) => {
      const nextRow = current.row + direction.dr;
      const nextCol = current.col + direction.dc;
      return nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size && !maze[nextRow][nextCol].visited;
    });

    if (!neighbors.length) {
      stack.pop();
      continue;
    }

    const choice = neighbors[rand(0, neighbors.length - 1)];
    const nextRow = current.row + choice.dr;
    const nextCol = current.col + choice.dc;

    maze[current.row][current.col].walls[choice.wall] = false;
    maze[nextRow][nextCol].walls[choice.opposite] = false;
    maze[nextRow][nextCol].visited = true;
    stack.push({ row: nextRow, col: nextCol });
  }

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      delete maze[row][col].visited;
    }
  }

  const removable = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (col < size - 1) {
        removable.push({ row, col, wall: "right", nextRow: row, nextCol: col + 1, opposite: "left" });
      }
      if (row < size - 1) {
        removable.push({ row, col, wall: "bottom", nextRow: row + 1, nextCol: col, opposite: "top" });
      }
    }
  }

  shuffle(removable)
    .slice(0, extraRemovals)
    .forEach((entry) => {
      maze[entry.row][entry.col].walls[entry.wall] = false;
      maze[entry.nextRow][entry.nextCol].walls[entry.opposite] = false;
    });

  return maze;
}

export function coordsKey(row, col) {
  return `${row}-${col}`;
}