import { test } from 'node:test';
import assert from 'assert';
import { maze } from './maze.mjs';

[
  [2, 2, '██\n██'],
  [10, 10, '██████████\n██████████\n██████████\n██████████\n██████████\n██████████\n██████████\n██████████\n██████████\n██████████'],
].forEach(([w, h, expected]) => {
  test(`maze reset [${w}, ${h}]`, () => {
    const g = maze(w, h);
    assert.strictEqual(g.toString(), expected);
  });
});

[
  { w: 2, h: 2, expectedBorderLength: 4 },
  { w: 2, h: 10, expectedBorderLength: 20 },
  { w: 10, h: 2, expectedBorderLength: 20 },
].forEach(({ w, h, expectedBorderLength }) => {
  test(`maze boarder length of [${w}, ${h}]`, () => {
    assert.strictEqual(maze(w, h).borderLength, expectedBorderLength);
  });
});

[
  { w: 2, h: 2 },
  { w: 2, h: 10 },
  { w: 10, h: 10 },
  { w: 100, h: 100 },
  { w: 100, h: 2 },
  { w: 2, h: 100 },
].forEach(({ w, h }) => {
  test(`maze randomEntry on (${w}, ${h})`, () => {
    const g = maze(w, h).randomEntry();
    const count = g.borders.filter((v) => v === ' ').length;
    assert.strictEqual(count, 1);
  });
});

[
  { w: 2, h: 2, open: 0, expectX: 0, expectY: 0 },
  { w: 2, h: 2, open: 1, expectX: 1, expectY: 0 },
  { w: 2, h: 2, open: 2, expectX: 0, expectY: 1 },
  { w: 2, h: 2, open: 3, expectX: 1, expectY: 1 },
  { w: 5, h: 5, open: 12, expectX: 1, expectY: 4 },
  { w: 2, h: 10, open: 2, expectX: 0, expectY: 1 },
  { w: 2, h: 10, open: 3, expectX: 1, expectY: 1 },
  { w: 2, h: 10, open: 4, expectX: 0, expectY: 2 },
].forEach(({ w, h, open, expectX, expectY }) => {
  test(`maze openEntry on ${open} of [${w}, ${h}]`, () => {
    const g = maze(w, h).openEntry(open);
    const openCount = g.borders.filter((v) => v === ' ').length;
    assert.strictEqual(openCount, 1);
    assert.strictEqual(g.get({ x: expectX, y: expectY }), ' ');
  });
});

[
  [{ w: 2, h: 2 }, '███ ', { x: 1, y: 1 }],
  [{ w: 2, h: 2 }, '██ █', { x: 0, y: 1 }],
  [{ w: 2, h: 2 }, '█ ██ ', { x: 1, y: 0 }],
  [{ w: 2, h: 2 }, ' ███ ', { x: 0, y: 0 }],
].forEach(([size, load, expectedEntry]) => {
  test(`maze load [${size.w}, ${size.h}]:${load}`, () => {
    const g = maze(size.w, size.h).load(load);
    assert.strictEqual(g.entry.x, expectedEntry.x);
    assert.strictEqual(g.entry.y, expectedEntry.y);
  });
});
