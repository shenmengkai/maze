const WALL = '█';

class Maze {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.entry = { x: 0, y: 0 };
    this.grid = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => '')
    );
    this.#reset();
  }

  load(grid) {
    const chars = grid.split('');
    if (!Array.isArray(chars) || !chars.length) {
      throw new Error('Invalid grid');
    }
    for (let i = 0; i < chars.length; i++) {
      const y = Math.floor(i / this.w);
      const x = i % this.w;
      if (!this.#validate({ x, y })) {
        continue;
      }
      this.#set({ x, y }, chars[i]);
      if (chars[i] === ' ') {
        this.entry.x = x;
        this.entry.y = y;
      }
    }
    return this;
  }

  #set({ x, y }, v) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      throw new Error(`Index[${x}, ${y}] out of bounds(${this.w}, ${this.h})`);
    }
    this.grid[y][x] = v;
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

  gen() {
    for (let y = 0; i < this.size.h; y++) {
      for (let x = 0; j < this.size.w; x++) {
        if (Math.random() > 0.3) {
          this.set(x, y, ' ');
        }
      }
    }
    return this;
  }

  /** Determine it is inside the maze */
  #validate({ x, y }, throwOrNot = false) {
    if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
      if (throwOrNot) {
        throw new Error(`Index[${x}, ${y}] out of bounds(${this.w}, ${this.h})`);
      }
      return false;
    }
    return true;
  }

  get(pos) {
    this.#validate(pos, true);
    return this.grid[pos.y][pos.x];
  }

  getGrid() {
    return this.grid;
  }

  randomEntry() {
    const entryIndex = Math.floor(Math.random() * this.borderLength);
    this.openEntry(entryIndex);
    return this;
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

  openEntry(entryIndex) {
    const borderLength = this.w * 2 + this.h * 2 - 4;
    let entryX = 0, entryY = 0;
    if (entryIndex < this.w) { // first row
      entryX = entryIndex;
    } else if (entryIndex >= borderLength - this.w) { // last row
      entryX = entryIndex - this.w - (this.h - 2) * 2;
      entryY = this.h - 1;
    } else {
      const gap = entryIndex - this.w;
      entryX = gap % 2 === 0 ? 0 : (this.w - 1);
      entryY = Math.floor(gap / 2) + 1;
    }

    this.entry = { x: entryX, y: entryY };
    this.#set(this.entry, ' ');
    return this;
  }
}

export const maze = (w, h) => new Maze(w, h);
