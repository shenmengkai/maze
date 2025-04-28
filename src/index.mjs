import { maze } from './maze.mjs'
import { dfs } from './dfs.mjs'
import { redis } from './redis.mjs'
import { idgen } from './algo.mjs'

export const handler = async (event) => {
  // CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: ''
    };
  }

  const { width, height } = getSize(event);
  let id = getId(event);
  if (id) {
    const saved = await redis.get(id);
    if (saved) {
      return {
        maze: JSON.parse(saved),
        id,
      }
    }
  }

  const m = maze(width, height);
  dfs(m, m.center());
  id = idgen();
  redis.set(id, JSON.stringify(m.getGrid()));
  return {
    maze: m.getGrid(),
    id,
  }
}

const getSize = (event) => {
  const size = { width: 20, height: 20 }
  try {
    const wh = event.queryStringParameters.s.split(',').map(s => s.trim()).filter(Boolean);
    if (wh.length == 1) {
      wh.push(wh[0]);
    }
    const width = parseInt(wh[0], 10);
    const height = parseInt(wh[1], 10);
    return { width, height };
  }
  catch {
    return size;
  }
}

const getId = (event) => event.queryStringParameters.id;
