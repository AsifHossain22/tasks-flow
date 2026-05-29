import React, { useEffect, useState } from 'react';
import initialState from './data/initialState';
import Navbar from './components/Navbar/Navbar';

function App() {
  // GetFromLocalStorage
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('tasks_flow_root_data');
    return saved ? JSON.parse(saved) : initialState;
  });

  // ActiveCardId
  const [activeCardId, setActiveCardId] = useState(null);

  // SetToLocalStorage
  useEffect(() => {
    localStorage.setItem('tasks_flow_root_data', JSON.stringify(state));
  }, [state]);

  // UpdateBoardTitle
  const updateBoardTitle = newTitle => {
    setState(prev => ({ ...prev, boardTitle: newTitle }));
  };

  // HandleResetBoard
  const handleResetBoard = () => {
    if (window.confirm('Reset all and clear local storage data?')) {
      setState(initialState);
      setActiveCardId(null);
    }
  };
  return (
    <div className="min-h-screen bg-(--bg) text-(--text1) flex flex-col select-none">
      {/* Navbar */}
      <Navbar
        title={state.boardTitle}
        onTitleChange={updateBoardTitle}
        onReset={handleResetBoard}
      />

      {/* Main */}
      <main></main>
    </div>
  );
}

export default App;
