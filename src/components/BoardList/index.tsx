import { useBoard } from '../../contexts/BoardContext/BoardContext';
import { useSearch } from '../../contexts/SearchContext/SearchContext';
import { BoardCard } from '../Board';

import styles from './styles.module.css';

export function BoardList() {
  const { state } = useBoard();
  const { query } = useSearch();

  // O estado é Record<string, Board> → convertemos para array
  const boards = Object.values(state.boards);

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <section className={styles.container}>
      {/* CABEÇALHO DA SEÇÃO */}
      <div className={styles.header}>
        <div className={styles.header__titleGroup}>
          <h1 className={styles.header__title}>
            Quadros de Trabalho
            <span className={styles.header__badge}>
              {filteredBoards.length}
            </span>
          </h1>
          <p className={styles.header__subtitle}>
            Gerencie seus projetos, visualize métricas e organize fluxos no
            Kanban.
          </p>
        </div>
      </div>
      {/* ---------- EMPTY STATE (Sem boards criados) ---------- */}
      {boards.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.empty__iconBadge}>📋</div>
          <h2 className={styles.empty__title}>Nenhum quadro criado ainda</h2>
          <p className={styles.empty__text}>
            Clique no botão <strong>"+ Novo Board"</strong> no topo para criar
            seu primeiro espaço de trabalho.
          </p>
        </div>
      )}

      {/* ---------- EMPTY STATE (Busca sem resultados) ---------- */}
      {boards.length > 0 && filteredBoards.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.empty__iconBadge}>🔍</div>
          <h2 className={styles.empty__title}>Nenhum resultado encontrado</h2>
          <p className={styles.empty__text}>
            Não encontramos nenhum board correspondente à busca{' '}
            <em>"{query}"</em>.
          </p>
        </div>
      )}

      {/* ---------- GRID ---------- */}
      {filteredBoards.length > 0 && (
        <div className={styles.grid}>
          {filteredBoards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </section>
  );
}
