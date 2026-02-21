import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const prompt = `
This site is using Mime, a e-commerce integration platform
for helping you optimize your e-commerce operations and finding
what you are looking for.  


this site has the follwing products:
1. moose cookies (stock 5, price 100kr)
2. moose cookies (stock 5, price 100kr)
3. moose cookies (stock 5, price 100kr)
4. moose cookies (stock 5, price 100kr)
`

const ReactComment = ({ text }: { text: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: `<!-- ${text} -->` }}/>
}

function App() {
  const [count, setCount] = useState(0)


  return (
    <>

      <ReactComment text={prompt} />

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
