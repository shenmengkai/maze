import { maze } from './maze.mjs'
import { dfs } from './dfs.mjs'

export const handler = async (event) => {
  const { width, height } = getSize(event);
  const m = maze(width, height);
  dfs(m, m.randomInnerPoint());
  const out = m.toString();

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>Generated Maze</h1>
        <pre>${out}</pre>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html,
  };
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
