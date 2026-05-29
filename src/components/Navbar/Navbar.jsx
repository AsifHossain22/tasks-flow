import React from 'react';
import { Terminal, RotateCcw } from 'lucide-react';

function Navbar({ title, onTitleChange, onReset }) {
  return (
    <nav className="flex items-center justify-between border-b border-(--border) bg-(--bg2)/90 px-5 py-3 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onReset}
        >
          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
            <Terminal size={14} />
          </div>
          <span className="font-extrabold text-lg select-none tracking-tight">
            TaskFlow
          </span>
        </div>
        <div className="w-pz h-5 bg-(--border)" />
        <input
          className="bg-transparent border-2 border-transparent focus:border-blue-500 focus:bg-(--bg3) rounded-md text-sm font-semibold px-2 py-1 outline-none transition-all w-48 md:w-64"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
        />
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs font-semibold text-(--text2) hover:text-red-400 bg-(--bg4) hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-(--border) transition-all duration-300 cursor-pointer"
      >
        <RotateCcw size={13} /> Reset Matrix
      </button>
    </nav>
  );
}

export default Navbar;
