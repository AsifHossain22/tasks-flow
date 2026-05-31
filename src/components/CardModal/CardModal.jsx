import React, { useState } from 'react';
import {
  X,
  Layout,
  AlignLeft,
  CheckSquare,
  Calendar,
  Palette,
  Trash2,
} from 'lucide-react';

const SWATCH_COLORS = ['#EF4444', '#F97316', '#3B82F6', '#71717A'];

function CardModal({ card, lists, onClose, onUpdate, onDelete }) {
  const [desc, setDesc] = useState(card.description || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [checkItemText, setCheckItemText] = useState('');

  const currentListId = Object.keys(lists).find(id =>
    lists[id].cardIds.includes(card.id),
  );
  const listTitle = currentListId ? lists[currentListId].title : '';

  const handleSaveDescription = () => {
    onUpdate({ ...card, description: desc.trim() });
    setIsEditingDesc(false);
  };

  const handleAddCheckItem = e => {
    e.preventDefault();
    if (!checkItemText.trim()) return;
    const newItem = {
      id: `ci-${Date.now()}`,
      text: checkItemText.trim(),
      done: false,
    };
    onUpdate({ ...card, checklist: [...(card.checklist || []), newItem] });
    setCheckItemText('');
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-start justify-center p-4 pt-16 z-50 overflow-y-auto">
      <div className="bg-(--bg2) border border-(--border2) rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col">
        {card.coverColor && (
          <div
            className="h-6 w-full"
            style={{ backgroundColor: card.coverColor }}
          />
        )}

        {/* ModalTopHeaderArea */}
        <div className="p-4 flex items-start gap-3">
          <Layout className="text-(--text2) mt-2 shrink-0" size={18} />
          <div className="flex-1">
            <input
              className="bg-transparent text-lg font-bold border-2 border-transparent focus:border-blue-500 focus:bg-(--bg3) rounded-lg px-2 py-0.5 w-full outline-none transition-all"
              value={card.title}
              onChange={e => onUpdate({ ...card, title: e.target.value })}
            />
            <p className="text-xs text-(--text3) px-2 mt-0.5">
              In category:{' '}
              <span className="text-(--text2) underline">{listTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-(--text2) hover:bg-(--bg4) p-2 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* ModalLayoutConfigurationGridSplit */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-(--text2) font-semibold text-xs uppercase tracking-wider">
                <AlignLeft size={14} /> Description
              </div>
              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full bg-(--bg3) border border-blue-500 text-sm rounded-lg p-3 outline-none text-(--text1) resize-none h-24 focus:ring-2 focus:ring-blue-500/20"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setDesc(card.description || '');
                        setIsEditingDesc(false);
                      }}
                      className="text-(--text2) text-xs hover:bg-(--bg4) px-3 py-1.5 rounded-lg duration-150 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingDesc(true)}
                  className="bg-(--bg3) text-sm p-3 rounded-lg border border-transparent hover:border-(--border)` text-(--text2) cursor-text min-h-16 leading-relaxed"
                >
                  {card.description || (
                    <span className="italic text-(--text3)">
                      Add a detailed description for this task...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ChecklistOperations*/}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-(--text2) font-semibold text-xs uppercase tracking-wider">
                <CheckSquare size={14} /> Checklist
              </div>
              <div className="space-y-1">
                {(card.checklist || []).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-1.5 hover:bg-(--bg3) rounded-lg group transition-all duration-100"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        onUpdate({
                          ...card,
                          checklist: card.checklist.map(i =>
                            i.id === item.id ? { ...i, done: !i.done } : i,
                          ),
                        })
                      }
                      className="w-4 h-4 rounded border-(--border) text-blue-500 focus:ring-0 cursor-pointer"
                    />
                    <span
                      className={`text-sm flex-1 ${item.done ? 'line-through text-(--text3)' : 'text-(--text1)'}`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() =>
                        onUpdate({
                          ...card,
                          checklist: card.checklist.filter(
                            i => i.id !== item.id,
                          ),
                        })
                      }
                      className="text-(--text3) hover:text-red-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="bg-(--bg3) text-xs p-2 rounded-lg flex-1 border border-(--border) outline-none focus:border-blue-500"
                  placeholder="Add item..."
                  value={checkItemText}
                  onChange={e => setCheckItemText(e.target.value)}
                />
                <button
                  onClick={handleAddCheckItem}
                  className="bg-(--bg4) hover:bg-(--border) border border-(--border) text-(--text2) hover:text-(--text1) text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* ComponentActionSidebarColumnPanels */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-(--text3) block">
                Due Date
              </span>
              <div className="flex items-center gap-1.5 bg-(--bg3) p-2 rounded-lg border border-(--border)">
                <Calendar size={13} className="text-(--text2)" />
                <input
                  type="date"
                  className="bg-transparent text-xs text-(--text2) outline-none w-full cursor-pointer invert opacity-85"
                  value={card.dueDate || ''}
                  onChange={e =>
                    onUpdate({ ...card, dueDate: e.target.value || null })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-(--text3) block">
                Cover Swatch
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {SWATCH_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ ...card, coverColor: color })}
                    className={`h-6 rounded-md transition-transform border ${card.coverColor === color ? 'scale-110 border-white' : 'border-transparent hover:scale-105'} duration-150 cursor-pointer`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {card.coverColor && (
                <button
                  onClick={() => onUpdate({ ...card, coverColor: null })}
                  className="text-[11px] font-semibold text-(--text3) hover:text-(--text2) underline duration-150 cursor-pointer"
                >
                  Remove Cover
                </button>
              )}
            </div>

            <hr className="border-(--border)/50 my-2" />

            <button
              onClick={() => onDelete(card.id, currentListId)}
              className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs font-bold py-2 rounded-lg transition-all shadow-sm duration-150 cursor-pointer"
            >
              <Trash2 size={13} /> Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
