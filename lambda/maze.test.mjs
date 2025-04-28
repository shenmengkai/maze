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
