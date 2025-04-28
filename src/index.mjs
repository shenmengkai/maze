import { maze } from './maze.mjs'
import { dfs } from './dfs.mjs'

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
  const m = maze(width, height);
  dfs(m, m.center());
  return {
    maze: m.getGrid(),
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
