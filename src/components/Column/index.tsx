import { useState } from 'react';
import type { FormEvent } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card } from '../Card';
import styles from '../../pages/BoardPage/styles.module.css';

type ColumnProps = {
  column: { id: string; title: string; cardIds: string[] };
  cards: Record<string, { id: string; title: string; createdAt: number | string }>;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
};

function getColumnAccentClass(title: string, id: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('fazer') || lower.includes('to do') || id === 'col-1') {
    return styles['column--todo'];
  }
  if (lower.includes('progresso') || lower.includes('doing') || lower.includes('estudar') || id === 'col-2') {
    return styles['column--doing'];
  }
  if (lower.includes('conclu') || lower.includes('done') || lower.includes('praticar') || id === 'col-3') {
    return styles['column--done'];
  }
  return styles['column--default'];
}

export function Column({ column, cards, onAddCard, onDeleteCard, onDeleteColumn }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  function handleAddCard(e: FormEvent) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onAddCard(column.id, newCardTitle.trim());
    setNewCardTitle('');
    setIsAddingCard(false);
  }

  const accentClass = getColumnAccentClass(column.title, column.id);

  return (
    <div className={`${styles.column} ${accentClass}`}>
      <div className={styles.column__header}>
        <div className={styles.column__titleGroup}>
          <span className={styles.column__badgeDot} />
          <h3 className={styles.column__title}>{column.title}</h3>
          <span className={styles.column__count}>{column.cardIds.length}</span>
        </div>
        {onDeleteColumn && (
          <button
            type='button'
            className={styles.column__deleteBtn}
            onClick={() => onDeleteColumn(column.id)}
            title='Excluir coluna'
          >
            ✕
          </button>
        )}
      </div>

      <Droppable
        droppableId={column.id}
        renderClone={(provided, snapshot, rubric) => {
          const cardId = column.cardIds[rubric.source.index];
          const card = cards[cardId];
          if (!card) return null;
          return (
            <Card
              id={card.id}
              title={card.title}
              createdAt={card.createdAt}
              index={rubric.source.index}
              onDelete={id => onDeleteCard(column.id, id)}
              provided={provided}
              snapshot={snapshot}
            />
          );
        }}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.cardsList} ${
              snapshot.isDraggingOver ? styles['cardsList--draggingOver'] : ''
            }`}
          >
            {column.cardIds.length === 0 && !snapshot.isDraggingOver && (
              <div className={styles.emptyColumnPlaceholder}>
                <p>Sem cards aqui</p>
                <span>Arraste ou clique abaixo</span>
              </div>
            )}

            {column.cardIds.map((cardId, index) => {
              const card = cards[cardId];
              if (!card) return null;
              return (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  createdAt={card.createdAt}
                  index={index}
                  onDelete={cardId => onDeleteCard(column.id, cardId)}
                />
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isAddingCard ? (
        <form onSubmit={handleAddCard} className={styles.addForm}>
          <input
            type='text'
            className={styles.addInput}
            placeholder='Título do card...'
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            autoFocus
          />
          <div className={styles.addFormActions}>
            <button type='submit' className={styles.addBtnSubmit}>
              Criar Card
            </button>
            <button
              type='button'
              className={styles.addBtnCancel}
              onClick={() => setIsAddingCard(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type='button'
          className={styles.addBtnTrigger}
          onClick={() => {
            setIsAddingCard(true);
            setNewCardTitle('');
          }}
        >
          <span>+</span> Adicionar Card
        </button>
      )}
    </div>
  );
}