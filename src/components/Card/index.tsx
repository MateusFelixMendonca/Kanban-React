import type { CSSProperties } from 'react';
import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import styles from '../../pages/BoardPage/styles.module.css';

type CardProps = {
  id: string;
  title: string;
  createdAt: number | string;
  index: number;
  onDelete: (cardId: string) => void;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
};

function getCardStyle(
  providedStyle: CSSProperties | undefined,
  snapshot?: DraggableStateSnapshot,
): CSSProperties {
  if (!providedStyle) return {};
  if (!snapshot?.isDragging) return providedStyle;

  // When drop animation starts (returning card to source or dropping to destination),
  // preserve providedStyle completely so hello-pangea/dnd can transition 'transform'
  // and trigger the CSS transitionend event needed to complete drop cleanup.
  if (snapshot.isDropAnimating) {
    return {
      ...providedStyle,
      zIndex: 9999,
    };
  }

  return {
    ...providedStyle,
    transform: providedStyle.transform
      ? `${providedStyle.transform} rotate(2deg) scale(1.03)`
      : 'rotate(2deg) scale(1.03)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
    zIndex: 9999,
  };
}

export function Card({
  id,
  title,
  createdAt,
  index,
  onDelete,
  provided: externalProvided,
  snapshot: externalSnapshot,
}: CardProps) {
  if (externalProvided && externalSnapshot) {
    return (
      <div
        ref={externalProvided.innerRef}
        {...externalProvided.draggableProps}
        {...externalProvided.dragHandleProps}
        style={getCardStyle(externalProvided.draggableProps.style, externalSnapshot)}
        className={`${styles.cardItem} ${
          externalSnapshot.isDragging ? styles['cardItem--dragging'] : ''
        }`}
      >
        <div className={styles.cardItem__header}>
          <h4 className={styles.cardItem__title}>{title}</h4>
          <button
            type='button'
            className={styles.cardItem__deleteBtn}
            onClick={e => {
              e.stopPropagation();
              onDelete(id);
            }}
            title='Excluir card'
          >
            ✕
          </button>
        </div>
        <div className={styles.cardItem__footer}>
          <span className={styles.cardItem__date}>
            {new Date(createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getCardStyle(provided.draggableProps.style, snapshot)}
          className={`${styles.cardItem} ${
            snapshot.isDragging ? styles['cardItem--dragging'] : ''
          }`}
        >
          <div className={styles.cardItem__header}>
            <h4 className={styles.cardItem__title}>{title}</h4>
            <button
              type='button'
              className={styles.cardItem__deleteBtn}
              onClick={e => {
                e.stopPropagation();
                onDelete(id);
              }}
              title='Excluir card'
            >
              ✕
            </button>
          </div>
          <div className={styles.cardItem__footer}>
            <span className={styles.cardItem__date}>
              {new Date(createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}