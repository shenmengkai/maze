import { Maze } from './maze.mjs';
import { shffule } from './algo.mjs';

const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

/**
 * @param {Maze} maze
 * @param {{x,y}} start
 */
export const dfs = (maze, start) => {
  const stack = [start];
  maze.setRoad(stack[0]);
  while (stack.length) {
    const visited = stack.at(-1);
    const { x, y } = visited;
    const neighbors = newNeighbors(maze, x, y)
      .filter(({ neightbor }) => {
        if (maze.exit.length == 0) return true;
        if (maze.exit.length == 1 && maze.isBorder(neightbor)) {
          // prevent 2 exit at the same side
          return maze.isClosedBorder(neightbor);
        }
        return !maze.isBorder(neightbor);
      });
    if (!neighbors.length) {
      stack.pop();
      continue;
    }
    const { wall, neightbor } = neighbors[0];

    if (maze.isBorder(neightbor)) {
      maze.exit.push(neightbor);
      maze.solution.push(...stack, neightbor);
    }
    maze.setRoad(neightbor);
    maze.setRoad(wall);
    stack.push(neightbor);
  }
}

/**
 * @param {Maze} maze
 */
export const newNeighbors = (maze, x, y) => {
  const neighbors = [];
  const iamBorder = maze.isBorder({ x, y });
  const branch = ([dx, dy]) => {
    const w = { x: x + dx, y: y + dy };
    const n = { x: x + dx * 2, y: y + dy * 2 };
    const leaf = DIRECTIONS.filter(([a, b]) => a !== dx || b !== dy);
    return {
      w,
      n,
      c1: { x: n.x + leaf[0][0], y: n.y + leaf[0][1] },
      c2: { x: n.x + leaf[1][0], y: n.y + leaf[1][1] },
      c3: { x: n.x + leaf[2][0], y: n.y + leaf[2][1] },
    }
  };
  shffule(DIRECTIONS.map(branch)).forEach(({ n, w, c1, c2, c3 }) => {
    // not out of bounds
    if (!maze.validate(w)) {
      return;
    }
    // not walk on the border
    if (iamBorder && maze.isBorder(w)) {
      return;
    }
    // not connect another visited
    if (maze.isVisited(c1) || maze.isVisited(c2) || maze.isVisited(c3)) {
      return;
    }
    if (maze.isWall(n)) {
      neighbors.push({ wall: w, neightbor: n });
      return;
    }
    if (!maze.validate(n) && maze.isWall(w)) {
      neighbors.push({ wall: w, neightbor: w });
    }
  });
  return neighbors;
}
