import React, { useEffect, useState } from 'react';
import initialState from './data/initialState';
import Navbar from './components/Navbar/Navbar';
import { DragDropContext } from '@hello-pangea/dnd';
import QuadrantColumn from './components/QuadrantColumn/QuadrantColumn';
import CardModal from './components/CardModal/CardModal';
import Swal from 'sweetalert2';
import { Plus, X } from 'lucide-react';

function App() {
  // GetFromLocalStorage
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('tasks_flow_root_data');
    return saved ? JSON.parse(saved) : initialState;
  });

  // ActiveCardId
  const [activeCardId, setActiveCardId] = useState(null);

  // AddColumnState
  const [addColumn, setAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  // SetToLocalStorage
  useEffect(() => {
    localStorage.setItem('tasks_flow_root_data', JSON.stringify(state));
  }, [state]);

  // DarkThemeConfigSweetAlert2
  const swalCustomConfig = {
    background: '#161b22',
    color: '#e6edf3',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#21262d',
    customClass: {
      popup: 'border border-[#30363d] rounded-xl font-sans',
      cancelButton:
        'border border-[#30363d] text-[#8b949e] hover:text-white transition-colors',
    },
  };

  // UpdateBoardTitle
  const updateBoardTitle = newTitle => {
    setState(prev => ({ ...prev, boardTitle: newTitle }));
  };

  // HandleCreateColumnFunction
  const handleAddColumn = e => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnTitle.trim(),
      cardIds: [],
    };

    setState(prev => ({
      ...prev,
      lists: { ...prev.lists, [newColumnId]: newColumn },
      listOrder: [...prev.listOrder, newColumnId],
    }));

    setNewColumnTitle('');
    setAddColumn(false);
  };

  // HandleDeleteColumnFunction
  const handleDeleteColumn = columnId => {
    Swal.fire({
      title: 'Want to delete this column?',
      text: 'All tasks inside this column will be permanently removed!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete this column',
      cancelButtonText: 'Cancel',
      ...swalCustomConfig,
    }).then(result => {
      if (result.isConfirmed) {
        setState(prev => {
          const newColumnOrder = prev.listOrder.filter(id => id !== columnId);
          const newColumns = { ...prev.lists };
          const newCards = { ...prev.cards };

          // CleanUpCards
          newColumns[columnId].cardIds.forEach(cardId => {
            delete newCards[cardId];
          });
          delete newColumns[columnId];

          return {
            ...prev,
            columnOrder: newColumnOrder,
            columns: newColumns,
            cards: newCards,
          };
        });

        // SuccessMessage
        Swal.fire({
          title: 'Deleted!',
          text: 'The column has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          ...swalCustomConfig,
        });
      }
    });
  };

  // HandleAddCardFunction
  const handleAddCard = (listId, cardTitle) => {
    // GenerateId
    const newId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    // NewCard
    const newCard = {
      id: newId,
      title: cardTitle,
      description: '',
      checklist: [],
      dueDate: null,
      coverColor: null,
    };

    setState(prev => ({
      ...prev,
      cards: { ...prev.cards, [newId]: newCard },
      lists: {
        ...prev.lists,
        [listId]: {
          ...prev.lists[listId],
          cardIds: [...prev.lists[listId].cardIds, newId],
        },
      },
    }));
  };

  // HandleUpdateCardFunction
  const handleUpdateCardDetails = updatedCard => {
    setState(prev => ({
      ...prev,
      cards: { ...prev.cards, [updatedCard.id]: updatedCard },
    }));
  };

  // HandleDeleteCardFunction
  const handleDeleteCard = (cardId, listId) => {
    // ConfirmationBeforeDelete
    Swal.fire({
      title: 'Want to delete this task?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      ...swalCustomConfig,
    }).then(result => {
      if (result.isConfirmed) {
        setState(prev => {
          const updatedCards = { ...prev.cards };
          delete updatedCards[cardId];

          return {
            ...prev,
            cards: updatedCards,
            lists: {
              ...prev.lists,
              [listId]: {
                ...prev.lists[listId],
                cardIds: prev.lists[listId].cardIds.filter(id => id !== cardId),
              },
            },
          };
        });

        if (activeCardId === cardId) setActiveCardId(null);

        // SuccessMessage
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted successfully!.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          ...swalCustomConfig,
        });
      }
    });
  };

  // DragEnd
  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setState(prev => {
      const sourceList = prev.lists[source.droppableId];
      const destList = prev.lists[destination.droppableId];

      const sourceCardIds = [...sourceList.cardIds];
      sourceCardIds.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceCardIds.splice(destination.index, 0, draggableId);
        return {
          ...prev,
          lists: {
            ...prev.lists,
            [source.droppableId]: { ...sourceList, cardIds: sourceCardIds },
          },
        };
      } else {
        const destCardIds = [...destList.cardIds];
        destCardIds.splice(destination.index, 0, draggableId);
        return {
          ...prev,
          lists: {
            ...prev.lists,
            [source.droppableId]: { ...sourceList, cardIds: sourceCardIds },
            [destination.droppableId]: { ...destList, cardIds: destCardIds },
          },
        };
      }
    });
  };

  // HandleResetBoard
  const handleResetBoard = () => {
    // ConfirmationBeforeReset
    Swal.fire({
      title: 'Want to reset entire matrix?',
      text: 'This will wipe your current data entirely!',
      icon: 'danger',
      showCancelButton: true,
      confirmButtonText: 'Reset Data',
      cancelButtonText: 'Keep Data',
      ...swalCustomConfig,
    }).then(result => {
      if (result.isConfirmed) {
        setState(initialState);
        setActiveCardId(null);

        // SuccessMessage
        Swal.fire({
          title: 'Reset Completed!',
          text: 'The matrix has been reverted to default.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          ...swalCustomConfig,
        });
      }
    });
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
      <main className="p-5 flex-1 overflow-x-auto overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 items-start max-w-full mx-auto pb-4">
            {state.listOrder.map(listId => (
              <div key={listId} className="w-72 md:w-80 shrink-0">
                <QuadrantColumn
                  list={state.lists[listId]}
                  cards={state.cards}
                  onAddCard={handleAddCard}
                  onDeleteCard={handleDeleteCard}
                  onOpenModal={setActiveCardId}
                  onDeleteList={handleDeleteColumn}
                />
              </div>
            ))}
            {/* AddColumn */}
            <div className="w-72 md:w-80 shrink-0 bg-(--bg2)/60 border border-(--border) border-dashed rounded-xl p-3 backdrop-blur-md transition-all duration-150">
              {!addColumn ? (
                <button
                  onClick={() => setAddColumn(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-(--text2) hover:text-(--text1) hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                >
                  <Plus size={16} /> Add new column
                </button>
              ) : (
                <form
                  onSubmit={handleAddColumn}
                  className="flex flex-col gap-2.5"
                >
                  <input
                    type="text"
                    className="w-full bg-[#1a2332] border border-blue-500 rounded-lg text-xs p-2.5 text-(--text1) outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    placeholder="Column name..."
                    value={newColumnTitle}
                    onChange={e => setNewColumnTitle(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-1.5 justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-3 py-2 rounded-lg transition-all shadow-md cursor-pointer"
                    >
                      Add column
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddColumn(false);
                        setNewColumnTitle('');
                      }}
                      className="text-(--text2) hover:bg-(--bg4) p-2 rounded-lg transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </DragDropContext>
      </main>

      {/* Modal */}
      {activeCardId && state.cards[activeCardId] && (
        <CardModal
          card={state.cards[activeCardId]}
          lists={state.lists}
          onClose={() => setActiveCardId(null)}
          onUpdate={handleUpdateCardDetails}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
}

export default App;
