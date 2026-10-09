import { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode, Dispatch } from 'react';
import { initialData } from '../../utils/initialData';
import type { AppState } from '../../models/KanbanModels';

// ---------- ACTIONS ----------
export const ACTIONS = {
  ADD_BOARD: 'ADD_BOARD',
  ADD_COLUMN: 'ADD_COLUMN',
  ADD_CARD: 'ADD_CARD',
  MOVE_CARD: 'MOVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  DELETE_BOARD: 'DELETE_BOARD',
  DELETE_COLUMN: 'DELETE_COLUMN',
} as const;

export type BoardAction =
  | { type: typeof ACTIONS.ADD_BOARD; payload: { title: string } }
  | {
      type: typeof ACTIONS.ADD_COLUMN;
      payload: { boardId: string; title: string };
    }
  | {
      type: typeof ACTIONS.ADD_CARD;
      payload: { columnId: string; title: string };
    }
  | {
      type: typeof ACTIONS.DELETE_CARD;
      payload: { columnId: string; cardId: string };
    }
  | { type: typeof ACTIONS.DELETE_BOARD; payload: { boardId: string } }
  | { type: typeof ACTIONS.DELETE_COLUMN; payload: { columnId: string } }
  | {
      type: typeof ACTIONS.MOVE_CARD;
      payload: {
        cardId: string;
        sourceColId: string;
        destColId: string;
        destIndex: number;
      };
    };

type BoardContextType = {
  state: AppState;
  dispatch: Dispatch<BoardAction>;
};

const BoardContext = createContext<BoardContextType | null>(null);

// ---------- REDUCER ----------
function boardReducer(state: AppState, action: BoardAction): AppState {
  switch (action.type) {
    //////////////////////////////////////////////////
    case ACTIONS.ADD_BOARD: {
      const { title } = action.payload;
      const id = `board-${crypto.randomUUID()}`;

      return {
        ...state,
        boards: {
          ...state.boards,
          [id]: { id, title, columnIds: ['col-1', 'col-2', 'col-3'] },
        },
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.ADD_COLUMN: {
      const { boardId, title } = action.payload;
      const id = `col-${crypto.randomUUID()}`;

      return {
        ...state,
        boards: {
          ...state.boards,
          [boardId]: {
            ...state.boards[boardId],
            columnIds: [...state.boards[boardId].columnIds, id],
          },
        },
        columns: {
          ...state.columns,
          [id]: { id, title, cardIds: [] },
        },
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.ADD_CARD: {
      const { columnId, title } = action.payload;
      const id = `card-${crypto.randomUUID()}`;

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cardIds: [...state.columns[columnId].cardIds, id],
          },
        },
        cards: {
          ...state.cards,
          [id]: { id, title, createdAt: Date.now() },
        },
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.DELETE_CARD: {
      const { columnId, cardId } = action.payload;

      const newCards = { ...state.cards };
      delete newCards[cardId];

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cardIds: state.columns[columnId].cardIds.filter(
              (id: string) => id !== cardId,
            ),
          },
        },
        cards: newCards,
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.DELETE_BOARD: {
      const { boardId } = action.payload;
      const board = state.boards[boardId];
      if (!board) return state;

      const newBoards = { ...state.boards };
      delete newBoards[boardId];

      const newColumns = { ...state.columns };
      const newCards = { ...state.cards };

      // Remove colunas e cards em cascata
      board.columnIds.forEach((colId: string) => {
        const col = newColumns[colId];
        if (col) {
          col.cardIds.forEach((cardId: string) => delete newCards[cardId]);
          delete newColumns[colId];
        }
      });

      return {
        ...state,
        boards: newBoards,
        columns: newColumns,
        cards: newCards,
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.DELETE_COLUMN: {
      const { columnId } = action.payload;
      const { [columnId]: _colunaDeletada, ...restoDasColunas } = state.columns;

      const newBoards = { ...state.boards };
      Object.keys(newBoards).forEach(bId => {
        if (newBoards[bId].columnIds.includes(columnId)) {
          newBoards[bId] = {
            ...newBoards[bId],
            columnIds: newBoards[bId].columnIds.filter(id => id !== columnId),
          };
        }
      });

      return {
        ...state,
        boards: newBoards,
        columns: restoDasColunas,
      };
    }
    //////////////////////////////////////////////////
    case ACTIONS.MOVE_CARD: {
      const { cardId, sourceColId, destColId, destIndex } = action.payload;

      // ---------- CASO 1: mesma coluna (só reordena) ----------
      if (sourceColId === destColId) {
        const column = state.columns[sourceColId];
        const newCardIds = Array.from(column.cardIds);

        const sourceIndex = newCardIds.indexOf(cardId);
        newCardIds.splice(sourceIndex, 1); // remove da posição antiga
        newCardIds.splice(destIndex, 0, cardId); // insere na nova

        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColId]: { ...column, cardIds: newCardIds },
          },
        };
      }

      // ---------- CASO 2: colunas diferentes ----------
      const sourceCol = state.columns[sourceColId];
      const destCol = state.columns[destColId];

      const newSourceIds = sourceCol.cardIds.filter(id => id !== cardId);
      const newDestIds = Array.from(destCol.cardIds);
      newDestIds.splice(destIndex, 0, cardId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColId]: { ...sourceCol, cardIds: newSourceIds },
          [destColId]: { ...destCol, cardIds: newDestIds },
        },
      };
    }
    //////////////////////////////////////////////////
    default:
      return state;
  }
}

// ---------- PROVIDER ----------
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, () => {
    const stored = localStorage.getItem('kanban-state');
    return stored ? JSON.parse(stored) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('kanban-state', JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

// ---------- HOOK ----------
export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard deve ser usado dentro de BoardProvider');
  return ctx;
}

// A "fórmula" que se repete em todas as actions
// Toda action que adiciona ou modifica algo segue esse padrão:

// js
// return {
//   ...state,                       // 1. copia o estado inteiro
//   [dicionarioAfetado]: {          // 2. sobrescreve o dicionário afetado
//     ...state[dicionarioAfetado],  // 3. copia os itens antigos
//     [id]: novoValor,              // 4. adiciona/sobrescreve o item
//   },
// };
