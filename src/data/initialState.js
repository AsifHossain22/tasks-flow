const initialState = {
  boardTitle: 'Time Management Matrix',
  listOrder: ['q1', 'q2', 'q3', 'q4'],
  lists: {
    q1: { id: 'q1', title: 'Urgent & Important', cardIds: [] },
    q2: { id: 'q2', title: 'Not Urgent & Important', cardIds: [] },
    q3: { id: 'q3', title: 'Urgent & Not Important', cardIds: [] },
    q4: {
      id: 'q4',
      title: 'Not Urgent & Not Important',
      cardIds: [],
    },
  },
  cards: {},
};

export default initialState;
