import { Link } from 'react-router';
import styles from './styles.module.css';
import { ACTIONS, useBoard } from '../../contexts/BoardContext/BoardContext';
import { Modal } from '../Modal';
import { useState } from 'react';
import { useSearch } from '../../contexts/SearchContext/SearchContext';
import { SwitchTheme } from '../SwitchTheme';

export function TopBar() {
  const { dispatch } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { query, setQuery } = useSearch();

  function handleCreateBoard(title: string) {
    dispatch({ type: ACTIONS.ADD_BOARD, payload: { title } });
  }

  return (
    <header className={styles.topbar}>
      {/* LADO ESQUERDO: Logo + Navegação */}
      <div className={styles.topbar__left}>
        <Link to="/" className={styles.topbar__brand} aria-label="Ir para a Home">
          <div className={styles.topbar__brandIconWrapper}>
            <span className={styles.topbar__brandIcon}>⚡</span>
          </div>
          <span className={styles.topbar__brandText}>KanbanFlow</span>
        </Link>

        <nav className={styles.topbar__nav} aria-label="Navegação principal">
          <Link to="/" className={`${styles.topbar__link} ${styles['topbar__link--active']}`}>
            📋 Meus Boards
          </Link>
        </nav>
      </div>

      {/* LADO DIREITO: Busca + Ações + Switch Tema + Avatar */}
      <div className={styles.topbar__right}>
        <div className={styles.topbar__search}>
          <span className={styles.topbar__searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.topbar__searchInput}
            placeholder="Buscar boards..."
            aria-label="Buscar boards"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className={styles.topbar__searchClear}
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`${styles.topbar__btn} ${styles['topbar__btn--primary']}`}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          <span className={styles.topbar__btnPlus}>+</span>
          <span>Novo Board</span>
        </button>

        <SwitchTheme />

        <div className={styles.topbar__avatarWrapper} title="Perfil do Usuário">
          <button
            className={styles.topbar__avatar}
            type="button"
            aria-label="Menu do usuário"
          >
            EU
          </button>
          <span className={styles.topbar__statusDot} title="Online"></span>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBoard}
        />
      </div>
    </header>
  );
}
