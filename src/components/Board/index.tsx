import type { MouseEvent } from 'react';
import { Link } from 'react-router';
import { useBoard, ACTIONS } from '../../contexts/BoardContext/BoardContext';
import type { Board } from '../../models/KanbanModels';
import styles from './styles.module.css';

export function BoardCard({ board }: { board: Board }) {
  const { state, dispatch } = useBoard();

  // ---------- CONTADORES ----------
  const cardCount = board.columnIds.reduce((acc: number, colId: string) => {
    const column = state.columns[colId];
    return acc + (column ? column.cardIds.length : 0);
  }, 0);

  const columnCount = board.columnIds.length;

  // ---------- DELETE ----------
  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();  // não navega (o card é um <Link>)
    e.stopPropagation(); // não dispara o clique do <Link>

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o board "${board.title}"?`
    );
    if (!confirmed) return;

    dispatch({
      type: ACTIONS.DELETE_BOARD,
      payload: { boardId: board.id },
    });
  }

  // ---------- RENDER ----------
  return (
    <Link to={`/board/${board.id}`} className={styles.card}>
      <div className={styles.card__accentBar} />

      {/* HEADER: título + botão delete */}
      <div className={styles.card__header}>
        <h3 className={styles.card__title}>{board.title}</h3>

        <button
          type="button"
          className={styles.card__delete}
          onClick={handleDelete}
          aria-label={`Excluir board ${board.title}`}
          title="Excluir quadro"
        >
          🗑️
        </button>
      </div>

      {/* META: contadores */}
      <div className={styles.card__meta}>
        <span className={styles.card__badge}>
          <span className={styles.card__badgeIcon}>📌</span>
          {columnCount} {columnCount === 1 ? 'coluna' : 'colunas'}
        </span>
        <span className={styles.card__badge}>
          <span className={styles.card__badgeIcon}>📄</span>
          {cardCount} {cardCount === 1 ? 'card' : 'cards'}
        </span>
      </div>

      <div className={styles.card__footer}>
        <span className={styles.card__actionText}>Acessar Quadro →</span>
      </div>
    </Link>
  );
}