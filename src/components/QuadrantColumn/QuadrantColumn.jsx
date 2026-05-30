import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, Trash2, CheckSquare, Calendar, FileText } from 'lucide-react';

function QuadrantColumn({ list, cards, onAddCard, onDeleteCard, onOpenModal }) {
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
    <div className="bg-(--bg2)/85 border border-(--border) rounded-xl flex flex-col max-h-[calc(100vh-100px)] backdrop-blur-md">
      {/* ListHeader */}
      <div className="p-3 flex items-center justify-between border-b border-(--border)/60">
        <h3 className="font-bold text-xs md:text-sm truncate pr-2">
          {list.title}
        </h3>
        <span className="text-[11px] font-bold bg-(--bg4) px-2 py-0.5 rounded-full text-(--text2)">
          {list.cardIds.length}
        </span>
      </div>

      {/* DroppableDropZoneContainer */}
      <Droppable droppableId={list.id}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-2 overflow-y-auto flex-1 flex flex-col gap-2 min-h-1"
          >
            {list.cardIds.map((id, index) => {
              const card = cards[id];
              if (!card) return null;

              const checkTotal = card.checklist?.length || 0;
              const checkDone = card.checklist?.filter(i => i.done).length || 0;

              return (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => onOpenModal(card.id)}
                      className={`bg-[#1a2332] border border-(--border)/80 rounded-lg group hover:border-blue-500/40 hover:bg-[#1e2b3e] transition-all duration-150 cursor-grab active:cursor-grabbing relative overflow-hidden animate-card-in ${
                        snapshot.isDragging
                          ? 'shadow-2xl border-blue-500 ring-2 ring-blue-500/20'
                          : ''
                      }`}
                    >
                      {card.coverColor && (
                        <div
                          className="h-2 w-full"
                          style={{ backgroundColor: card.coverColor }}
                        />
                      )}

                      <div className="p-3">
                        <p className="text-sm font-medium leading-relaxed wrap-break-word pr-6">
                          {card.title}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {card.description && (
                            <FileText size={13} className="text-(--text3)" />
                          )}
                          {card.dueDate && (
                            <span className="text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                              <Calendar size={11} /> {card.dueDate}
                            </span>
                          )}
                          {checkTotal > 0 && (
                            <span
                              className={`text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded ${
                                checkDone === checkTotal
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-(--bg4) text-(--text2)'
                              }`}
                            >
                              <CheckSquare size={11} /> {checkDone}/{checkTotal}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onDeleteCard(card.id, list.id);
                        }}
                        className="absolute top-2 right-2 p-1 text-(--text3) hover:text-red-400 bg-(--bg2)/80 rounded border border-(--border)/50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* InlineFormAddActionsWrapper */}
      <div className="p-2 border-t border-(--border)/30">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-1.5 p-2 text-xs text-(--text3) hover:bg-white/5 hover:text-(--text1) rounded-lg transition-all"
          >
            <Plus size={14} /> Add a card
          </button>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
            <textarea
              className="w-full bg-[#1a2332] border border-blue-500 rounded-lg text-xs p-2 text-(--text1) outline-none resize-none h-16 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter details for this task..."
              value={inputTitle}
              onChange={e => setInputTitle(e.target.value)}
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
            />
            <div className="flex gap-1.5">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-md"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setInputTitle('');
                }}
                className="text-(--text2) hover:bg-(--bg4) p-1.5 rounded-lg transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default QuadrantColumn;
