import type {AppState} from '../models/KanbanModels';

export const initialData: AppState = {
  boards: {
    'board-1': {
      id: 'board-1',
      title: 'Projeto Pessoal',
      columnIds: ['col-1', 'col-2', 'col-3'],
    },
    'board-2': {
      id: 'board-2',
      title: 'Estudos React',
      columnIds: ['col-4', 'col-5'],
    },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'To Do',  cardIds: ['card-1', 'card-2'] },
    'col-2': { id: 'col-2', title: 'Doing',  cardIds: ['card-3'] },
    'col-3': { id: 'col-3', title: 'Done',   cardIds: [] },
    'col-4': { id: 'col-4', title: 'Estudar', cardIds: ['card-4'] },
    'col-5': { id: 'col-5', title: 'Praticar', cardIds: [] },
  },
  cards: {
    'card-1': { id: 'card-1', title: 'Configurar Vite',       createdAt: Date.now() },
    'card-2': { id: 'card-2', title: 'Criar TopBar',           createdAt: Date.now() },
    'card-3': { id: 'card-3', title: 'Montar Context API',     createdAt: Date.now() },
    'card-4': { id: 'card-4', title: 'Ler docs do useReducer', createdAt: Date.now() },
  },
};