import { test } from 'node:test';
import assert from 'assert';
import { handler } from './index.mjs';

test('Lambda handler returns correct response', async (t) => {
  const event = {}; // mock event
  const response = await handler(event);

  assert.strictEqual(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.strictEqual(body.message, "Hello from Lambda!");
});
