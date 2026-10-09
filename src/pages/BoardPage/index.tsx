import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link } from 'react-router';
import { MainTemplate } from '../../templates/MainTemplate';
import { Container } from '../../components/Container';
import { useBoard, ACTIONS } from '../../contexts/BoardContext/BoardContext';
import { Column } from '../../components/Column';
import styles from './styles.module.css';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

export function BoardPage() {
  const { boardId } = useParams<{ boardId?: string }>();
  const { state, dispatch } = useBoard();

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const columnInputRef = useRef<HTMLInputElement>(null);

  const boardsList = Object.values(state.boards);
  const currentBoard = boardId ? state.boards[boardId] : boardsList[0];

  function handleStartAddingColumn() {
    setIsAddingColumn(true);
    setTimeout(() => {
      if (columnInputRef.current) {
        columnInputRef.current.focus();
      }
      if (boardContainerRef.current) {
        boardContainerRef.current.scrollTo({
          left: boardContainerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 50);
  }

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch({
      type: ACTIONS.MOVE_CARD,
      payload: {
        cardId: draggableId,
        sourceColId: source.droppableId,
        destColId: destination.droppableId,
        destIndex: destination.index,
      },
    });
  }

  function handleAddColumn(e: FormEvent) {
    e.preventDefault();
    if (!newColumnTitle.trim() || !currentBoard) return;

    dispatch({
      type: ACTIONS.ADD_COLUMN,
      payload: { boardId: currentBoard.id, title: newColumnTitle.trim() },
    });

    setNewColumnTitle('');
    setIsAddingColumn(false);
  }

  function handleAddCard(columnId: string, title: string) {
    if (!title.trim()) return;

    dispatch({
      type: ACTIONS.ADD_CARD,
      payload: { columnId, title: title.trim() },
    });
  }

  function handleDeleteCard(columnId: string, cardId: string) {
    dispatch({
      type: ACTIONS.DELETE_CARD,
      payload: { columnId, cardId },
    });
  }

  function handleDeleteColumn(columnId: string) {
    const cols = ['col-1', 'col-2', 'col-3'];
    if (cols.includes(columnId)) {
      return alert(
        'Aviso!! Não é possível remover as colunas base da aplicação.',
      );
    }
    if (state.columns[columnId]?.cardIds?.length > 0) {
      return alert(
        'Aviso!! Termine ou remova as tarefas desta coluna antes de excluí-la.',
      );
    }
    dispatch({
      type: ACTIONS.DELETE_COLUMN,
      payload: { columnId },
    });
  }

  if (!currentBoard) {
    return (
      <MainTemplate>
        <Container>
          <div className={styles.page}>
            <div className={styles.emptyBoard}>
              <h2>Quadro não encontrado</h2>
              <p>O quadro solicitado não existe ou foi removido.</p>
              <Link to='/' className={styles.backBtn}>
                ← Voltar para a lista de quadros
              </Link>
            </div>
          </div>
        </Container>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <Container>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={styles.page}>
            <header className={styles.header}>
              <div className={styles.header__left}>
                <Link to='/' className={styles.backBtn}>
                  ← Meus Quadros
                </Link>
                <h1 className={styles.title}>{currentBoard.title}</h1>
              </div>

              <div className={styles.header__actions}>
                <button
                  type='button'
                  className={styles.addColumnBtn}
                  onClick={handleStartAddingColumn}
                >
                  + Nova Coluna
                </button>
              </div>
            </header>

            <div className={styles.boardContainer} ref={boardContainerRef}>
              {currentBoard.columnIds.map(colId => {
                const column = state.columns[colId];
                if (!column) return null;
                return (
                  <Column
                    key={column.id}
                    column={column}
                    cards={state.cards}
                    onAddCard={handleAddCard}
                    onDeleteCard={handleDeleteCard}
                    onDeleteColumn={handleDeleteColumn}
                  />
                );
              })}

              <div className={styles.addColumnCardContainer}>
                {isAddingColumn ? (
                  <div className={styles.addColumnCardForm}>
                    <h4 className={styles.addColumnTitle}>Criar Nova Coluna</h4>
                    <form onSubmit={handleAddColumn} className={styles.addForm}>
                      <input
                        ref={columnInputRef}
                        type='text'
                        className={styles.addInput}
                        placeholder='Nome da coluna...'
                        value={newColumnTitle}
                        onChange={e => setNewColumnTitle(e.target.value)}
                        autoFocus
                      />
                      <div className={styles.addFormActions}>
                        <button type='submit' className={styles.addBtnSubmit}>
                          Adicionar Coluna
                        </button>
                        <button
                          type='button'
                          className={styles.addBtnCancel}
                          onClick={() => {
                            setIsAddingColumn(false);
                            setNewColumnTitle('');
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <button
                    type='button'
                    className={styles.addColumnCardTrigger}
                    onClick={handleStartAddingColumn}
                  >
                    <span className={styles.plusIcon}>+</span>
                    <span>Adicionar outra coluna</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      </Container>
    </MainTemplate>
  );
}
