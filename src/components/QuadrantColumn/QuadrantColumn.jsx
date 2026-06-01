import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X } from 'lucide-react';

function QuadrantColumn({ list, cards, onAddCard, onOpenModal, onDeleteList }) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputTitle, setInputTitle] = useState('');

  const handleFormSubmit = e => {
    e.preventDefault();
    if (!inputTitle.trim()) return;
    onAddCard(list.id, inputTitle.trim());
    setInputTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col max-h-[calc(100vh-140px)] shadow-sm">
      {/* ColumnHeader */}
      <div className="p-3 flex items-center justify-between border-b border-[#30363d]/60 bg-[#0d1117]/50 rounded-t-xl">
        <div className="flex items-center gap-2 truncate pr-2">
          <h3 className="font-semibold text-xs tracking-wider uppercase text-[#8b949e] truncate whitespace-normal">
            {list.title}
          </h3>
          <span className="text-[10px] font-mono font-bold bg-[#21262d] text-[#c9d1d9] border border-[#30363d] px-1.5 py-0.5 rounded-md shrink-0">
            {list.cardIds.length}
          </span>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onDeleteList(list.id);
          }}
          className="text-[#8b949e] hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
          title="Delete column"
        >
          <X size={13} />
        </button>
      </div>

      {/* TaskDropZoneContainer */}
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2.5 flex-1 overflow-y-auto space-y-2 min-h-37.5 transition-colors duration-150 ${
              snapshot.isDraggingOver ? 'bg-[#1f242c]/40' : 'bg-transparent'
            }`}
          >
            {list.cardIds.map((cardId, index) => {
              const card = cards[cardId];
              if (!card) return null;
              return (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.dragHandleProps}
                      {...dragProvided.draggableProps}
                      onClick={() => onOpenModal(card.id)}
                      className={`p-2.5 bg-[#0d1117] border rounded-lg cursor-pointer transition-colors ${
                        dragSnapshot.isDragging
                          ? 'border-[#58a6ff] bg-[#161b22]'
                          : 'border-[#30363d] hover:border-[#8b949e]'
                      }`}
                    >
                      <h4 className="text-xs font-medium text-[#c9d1d9] tracking-normal line-clamp-2">
                        {card.title}
                      </h4>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* ColumnFooter */}
      <div className="p-2 border-t border-[#30363d]/40">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-md transition-all cursor-pointer font-medium"
          >
            <Plus size={13} /> Add task
          </button>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 p-1">
            <input
              type="text"
              className="w-full bg-[#0d1117] border border-[#30363d] focus:border-[#58a6ff] rounded-md text-xs p-2 text-[#c9d1d9] outline-none transition-colors"
              placeholder="New task title..."
              value={inputTitle}
              onChange={e => setInputTitle(e.target.value)}
              autoFocus
            />
            <div className="flex gap-1 justify-end">
              <button
                type="submit"
                className="bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-xs px-2.5 py-1 rounded-md cursor-pointer transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setInputTitle('');
                }}
                className="text-[#8b949e] hover:bg-[#21262d] px-2 py-1 rounded-md cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default QuadrantColumn;
