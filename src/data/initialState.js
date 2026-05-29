export const initialState = {
  boardTitle: 'Time Management Matrix',
  listOrder: ['q1', 'q2', 'q3', 'q4'],
  lists: {
    q1: { id: 'q1', title: 'Quadrant 1: Urgent & Important', cardIds: [] },
    q2: { id: 'q2', title: 'Quadrant 2: Not Urgent & Important', cardIds: [] },
    q3: { id: 'q3', title: 'Quadrant 3: Urgent & Not Important', cardIds: [] },
    q4: {
      id: 'q4',
      title: 'Quadrant 4: Not Urgent & Not Important',
      cardIds: [],
    },
  },
  cards: {},
};
