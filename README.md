# Life is Maze

## Folders

| folder | description |
| -      | -  |
| lambda | lambda endpoint for generate maze and cache |
| web    | react app for rendering maze |

## API `/genMaze`

Generates maze, and save to redis cache. The maze comes with an ID could refernece to cache.

### Response

```ts
{
  maze: []
  id: 'VblQXQ'
}
```

- **maze**: 2 dimension array of maze, each elemets representing a block in maze. Each block contains
  - `"█"`: Wall of maze
  - `" "`: Road of maze
  - `"*"`: Soluion of maze

### Parameter size `/genMaze?s=10,10`

Generates maze with specified width and height

### Parameter id `/genMaze?id=123456`

Finds cached maze by id. It not found, generate new one.

## Algotithm

DFS to generate maze, and also record soluion path.

## Cloud Services

- AWS Amplify for web
- AWS Lambda for main app
- AWS ElastiCache for datasource
