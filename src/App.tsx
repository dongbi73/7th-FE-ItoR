// src/App.tsx
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="app-layout">
      {/* 상단바(Nav)*/}
      
      <main>
        <Outlet /> {/* Home.tsx 내용 */}
      </main>

      {/* 푸터(Footer)*/}
    </div>
  )
}

export default App