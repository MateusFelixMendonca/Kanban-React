import { useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link } from 'react-router';
import { MainTemplate } from '../../templates/MainTemplate';
import { Container } from '../../components/Container';
import { useBoard, ACTIONS } from '../../contexts/BoardContext/BoardContext';
import styles from './styles.module.css';

export function BoardPage() {
  const { boardId } = useParams<{ boardId?: string }>();
  const { state, dispatch } = useBoard();

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [activeAddingCardColId, setActiveAddingCardColId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');

  // Seleciona o board ativo
  const boardsList = Object.values(state.boards);
  const currentBoard = boardId ? state.boards[boardId] : boardsList[0];

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

  function handleAddCard(columnId: string, e: FormEvent) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    dispatch({
      type: ACTIONS.ADD_CARD,
      payload: { columnId, title: newCardTitle.trim() },
    });

    setNewCardTitle('');
    setActiveAddingCardColId(null);
  }

  function handleDeleteCard(columnId: string, cardId: string) {
    dispatch({
      type: ACTIONS.DELETE_CARD,
      payload: { columnId, cardId },
    });
  }

  if (!currentBoard) {
    return (
      <MainTemplate>
        <Container>
          <div className={styles.emptyBoard}>
            <h2>Nenhum Quadro Selecionado</h2>
            <p>Selecione um board na página inicial ou crie um novo.</p>
            <Link to="/" className={styles.backBtn}>
              ← Ir para Meus Boards
            </Link>
          </div>
        </Container>
      </MainTemplate>
    );
  }

  return (
    <MainTemplate>
      <Container>
        <div className={styles.page}>
          {/* CABEÇALHO DO BOARD */}
          <header className={styles.header}>
            <div className={styles.header__left}>
              <Link to="/" className={styles.backBtn}>
                ← Voltar
              </Link>
              <h1 className={styles.title}>{currentBoard.title}</h1>
            </div>

            <div className={styles.header__actions}>
              {!isAddingColumn ? (
                <button
                  type="button"
                  className={styles.addColumnBtn}
                  onClick={() => setIsAddingColumn(true)}
                >
                  <span>+</span> Nova Coluna
                </button>
              ) : (
                <form onSubmit={handleAddColumn} className={styles.addForm}>
                  <input
                    type="text"
                    className={styles.addInput}
                    placeholder="Nome da coluna..."
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    autoFocus
                  />
                  <div className={styles.addFormActions}>
                    <button type="submit" className={styles.addBtnSubmit}>
                      Adicionar
                    </button>
                    <button
                      type="button"
                      className={styles.addBtnCancel}
                      onClick={() => setIsAddingColumn(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </header>

          {/* ÁREA DE COLUNAS E CARDS */}
          <div className={styles.boardContainer}>
            {currentBoard.columnIds.length === 0 ? (
              <div className={styles.emptyBoard}>
                <h2>Nenhuma coluna neste quadro</h2>
                <p>Clique em "+ Nova Coluna" para começar a estruturar suas etapas de trabalho.</p>
              </div>
            ) : (
              currentBoard.columnIds.map((colId) => {
                const column = state.columns[colId];
                if (!column) return null;

                const isAddingCard = activeAddingCardColId === column.id;

                return (
                  <div key={column.id} className={styles.column}>
                    {/* Header da Coluna */}
                    <div className={styles.column__header}>
                      <div className={styles.column__titleGroup}>
                        <h3 className={styles.column__title}>{column.title}</h3>
                        <span className={styles.column__count}>
                          {column.cardIds.length}
                        </span>
                      </div>
                    </div>

                    {/* Lista de Cards */}
                    <div className={styles.cardsList}>
                      {column.cardIds.map((cardId) => {
                        const card = state.cards[cardId];
                        if (!card) return null;

                        return (
                          <div key={card.id} className={styles.cardItem}>
                            <div className={styles.cardItem__header}>
                              <h4 className={styles.cardItem__title}>
                                {card.title}
                              </h4>
                              <button
                                type="button"
                                className={styles.cardItem__deleteBtn}
                                onClick={() => handleDeleteCard(column.id, card.id)}
                                title="Excluir card"
                              >
                                ✕
                              </button>
                            </div>
                            <div className={styles.cardItem__footer}>
                              <span>
                                {new Date(card.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Adicionar Card */}
                    {isAddingCard ? (
                      <form
                        onSubmit={(e) => handleAddCard(column.id, e)}
                        className={styles.addForm}
                      >
                        <input
                          type="text"
                          className={styles.addInput}
                          placeholder="Título do card..."
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          autoFocus
                        />
                        <div className={styles.addFormActions}>
                          <button type="submit" className={styles.addBtnSubmit}>
                            Criar Card
                          </button>
                          <button
                            type="button"
                            className={styles.addBtnCancel}
                            onClick={() => setActiveAddingCardColId(null)}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className={styles.addBtnTrigger}
                        onClick={() => {
                          setActiveAddingCardColId(column.id);
                          setNewCardTitle('');
                        }}
                      >
                        <span>+</span> Adicionar Card
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Container>
    </MainTemplate>
  );
}