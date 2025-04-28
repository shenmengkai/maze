import { useState, useEffect } from 'react'
import './App.css'

const API = 'https://u2qsj2h70b.execute-api.ap-northeast-1.amazonaws.com/default/genMaze'

function App() {
  const [maze, setMaze] = useState(null)
  const [size, setSize] = useState(91)
  const [fetchTime, setFetchTime] = useState(null)
  const [paramId, setParamId] = useState(getUrlParam('id'))

  useEffect(() => {
    if (maze === null) {
      let url = `${API}?s=${size}`
      if (paramId) {
        url += `&id=${paramId}`
      }

      setFetchTime(null)
      const startTime = performance.now()
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const endTime = performance.now()
          setFetchTime((endTime - startTime).toFixed(2))
          setMaze(data.maze);
          if (!paramId) {
            window.history.pushState({}, '', `?id=${data.id}`)
          }
        })
        .catch((error) => console.error('Error fetching maze:', error))
    }
  }, [maze])

  useEffect(() => {
    const onPopState = (e) => {
      setParamId(getUrlParam('id'))
      setMaze(null)
    }

    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [])

  const handleNewClick = () => {
    setParamId(null)
    setMaze(null)
  }

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
          <button onClick={handleNewClick}>Generate New Maze</button>
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
      {fetchTime && <sub>in {fetchTime} ms</sub>}
    </div>
  )
}

export default App

const makeClassName = (maze, i, j) => {
  let arr = [];
  if (maze[i][j] === '█') {
    arr.push("wall");
  }
  else if (maze[i][j] === '*') {
    arr.push("path");
  }
  return arr.join(" ");
};

const getUrlParam = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};
