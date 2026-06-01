import React, { useEffect, useState } from 'react';
import { RotateCcw, LayoutDashboard } from 'lucide-react';

function Navbar({ title, onTitleChange, onReset }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(title);

  useEffect(() => {
    setInputTitle(title);
  }, [title]);

  const handleSubmit = e => {
    e.preventDefault();

    if (inputTitle.trim()) {
      onTitleChange(inputTitle.trim());
    }
    setIsEditing(false);
  };
  return (
    <nav className="bg-(--bg2)/80 backdrop-blur-md border-b border-(--border)/60 px-5 py-3 flex items-center justify-between transition-all duration-150">
      <div className="flex items-center gap-4">
        {/* LogoAndBrandName */}
        <div className="flex items-center gap-2 shrink-0">
          <LayoutDashboard className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
          <span className="font-black tracking-wider text-sm md:text-base bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            TasksFlow
          </span>
        </div>

        {/* DynamicBoardTitleInput */}
        <div className="hidden md:flex items-center max-w-md mx-4 flex-1 justify-center">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
              <input
                type="text"
                value={inputTitle}
                onChange={e => setInputTitle(e.target.value)}
                onBlur={handleSubmit}
                className="w-full bg-[#1a2332] border border-blue-500 rounded-lg text-sm px-3 py-1.5 text-(--text1) font-bold outline-none text-center"
                autoFocus
              />
            </form>
          ) : (
            <h1
              onClick={() => setIsEditing(true)}
              className="text-sm md:text-base font-bold text-(--text1) border border-transparent hover:border-(--border) hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all cursor-pointer truncate select-none max-w-xs"
              title="Click to rename board"
            >
              {title}
            </h1>
          )}
        </div>
      </div>

      {/* ResetButton */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-semibold text-xs md:text-sm px-3 py-1.5 md:py-2 rounded-lg transition-all cursor-pointer shadow-sm border border-red-500/20 hover:border-transparent"
          title="Reset Matrix Data"
        >
          <RotateCcw size={14} className="animate-hover" />
          {/* <span className="hidden sm:inline">Reset</span> */}
          <span className="">Reset</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
