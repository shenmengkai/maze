const WALL = '█';

export class Maze {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.exit = [];
    this.grid = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => '')
    );
    this.solution = [];
    this.#reset();
  }

  isClosedBorder(pos) {
    if (!this.validate(pos) || !this.isBorder(pos)) {
      return false;
    }
    for (const { x, y } of this.exit) {
      if ((x === 0 || x === this.w - 1) && pos.x === x) {
        return false;
      }
      if ((y === 0 || y === this.h - 1) && pos.y === y) {
        return false;
      }
    }
    return true;
  }

  isWall(pos) {
    return this.validate(pos) && this.get(pos) === WALL;
  }

  isVisited(pos) {
    return this.validate(pos) && this.get(pos) === ' ';
  }

  #set({ x, y }, v) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      throw new Error(`Index[${x}, ${y}] out of bounds(${this.w}, ${this.h})`);
    }
    this.grid[y][x] = v;
    return this;
  }

  setRoad({ x, y }) {
    this.#set({ x, y }, ' ');
    return this;
  }

  #reset() {
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        this.grid[i][j] = WALL;
      }
    }
    return this;
  }

  /** Determine it is inside the maze */
  validate({ x, y }, throwOrNot = false) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      if (throwOrNot) {
        throw new Error(`Index[${x}, ${y}] out of bounds(${this.w}, ${this.h})`);
      }
      return false;
    }
    return true;
  }

  isBorder({ x, y }) {
    return x === 0 || x === this.w - 1 || y === 0 || y === this.h - 1;
  }

  get(pos) {
    this.validate(pos, true);
    return this.grid[pos.y][pos.x];
  }

  get borderLength() {
    return (this.w + this.h) * 2 - 4;
  }

  get borders() {
    const borders = [...this.grid[0], ...this.grid[this.grid.length - 1]];
    for (let y = 1; y < this.grid.length - 1; y++) {
      borders.push(this.grid[y][0], this.grid[y][this.grid[y].length - 1]);
    }
    return borders;
  }

  randomInnerPoint() {
    const x = Math.floor(Math.random() * (this.w - 2)) + 1;
    const y = Math.floor(Math.random() * (this.h - 2)) + 1;
    return { x, y };
  }

  center() {
    const x = Math.floor(this.w / 2);
    const y = Math.floor(this.h / 2);
    return { x, y };
  }

  flat() {
    const out = JSON.parse(JSON.stringify(this.grid));
    for (const pos of this.solution) {
      out[pos.y][pos.x] = '*';
    }
    return out;
  }

  toString() {
    return this.grid.map((row) => row.join('')).join('\n');
  }

  print(title = '') {
    console.log((title ? `==${title}==\n` : '') + this.toString());
  }
}

export const maze = (w, h) => new Maze(w, h);
