import { test } from 'node:test';
import assert from 'assert';
import { maze } from './maze.mjs';
import { dfs, newNeighbors } from './dfs.mjs';

[
  [3, 3, '███ █████', { x: 1, y: 1 }, { x: 2, y: 1 }]
].forEach(([w, h, load, expectedWall, expectedNeighbor]) => {
  test(`maze dfs find neightbor of [${w}, ${h}]`, () => {
    const g = maze(w, h).load(load);
    const neighbors = newNeighbors(g, g.entry.x, g.entry.y);
    assert.strictEqual(neighbors.length, 1);
    const { wall, neightbor } = neighbors[0];
    assert.strictEqual(wall.x, expectedWall.x);
    assert.strictEqual(wall.y, expectedWall.y);
    assert.strictEqual(neightbor.x, expectedNeighbor.x);
    assert.strictEqual(neightbor.y, expectedNeighbor.y);
  });
});

test('maze dfs random', () => {
  const g = maze(20, 20);
  dfs(g, g.randomInnerPoint())
  const count = g.borders.filter((v) => v === ' ').length;
  assert.strictEqual(count, 2);
});
