import { useState, useEffect } from 'react'
import './App.css'

const API = 'https://u2qsj2h70b.execute-api.ap-northeast-1.amazonaws.com/default/genMaze'

function App() {
  const [maze, setMaze] = useState(null)
  const [size, setSize] = useState(20)
  const [fetchTime, setFetchTime] = useState(null)

  useEffect(() => {
    if (maze === null) {
      setFetchTime(null)
      const startTime = performance.now()
      fetch(`${API}?s=${size}`)
        .then((response) => response.json())
        .then((data) => {
          setMaze(data.maze);
          const endTime = performance.now()
          setFetchTime((endTime - startTime).toFixed(2))
        })
        .catch((error) => console.error('Error fetching maze:', error))
    }
  }, [maze])

  return (
    <div>
      <h2>Maze</h2>
      {maze ? (
        <>
          <input
            value={size}
            type="number"
            min="5"
            max="300"
            onChange={(e) => setSize(Number(e.target.value))} />
          <> </>
          <button onClick={() => setMaze(null)}>Generate New Maze</button>
          <table id="maze">
            <tbody>
              {maze.map((row, i) => (
                <tr key={`row-${i}`}>
                  {row.map((cell, j) => (
                    <td key={`cell-${i}-${j}`} className={makeClassName(maze, i, j)}>
                      <div />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </>
      ) : (
        <p>Running maze...</p>
      )}
      {fetchTime && <p>took: {fetchTime} ms</p>}
    </div>
  )
}

export default App

const makeClassName = (maze, i, j) => {
  let arr = [];
  if (maze[i][j] === '█') {
    arr.push("wall");
  }
  return arr.join(" ");
};
