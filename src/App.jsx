import React, { useEffect, useState } from 'react';
import initialState from './data/initialState';
import Navbar from './components/Navbar/Navbar';
import { DragDropContext } from '@hello-pangea/dnd';
import QuadrantColumn from './components/QuadrantColumn/QuadrantColumn';
import CardModal from './components/CardModal/CardModal';
import Swal from 'sweetalert2';

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
      <main className="p-5 flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start max-w-7xl mx-auto">
            {state.listOrder.map(listId => (
              <QuadrantColumn
                key={listId}
                list={state.lists[listId]}
                cards={state.cards}
                onAddCard={handleAddCard}
                onDeleteCard={handleDeleteCard}
                onOpenModal={setActiveCardId}
              />
            ))}
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
