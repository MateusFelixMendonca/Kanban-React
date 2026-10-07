import { Link } from 'react-router';
import { MainTemplate } from '../../templates/MainTemplate';
import { Container } from '../../components/Container';
import styles from './styles.module.css';

export function NotFound() {
  return (
    <MainTemplate>
      <Container>
        <div className={styles.notFound}>
          <div className={styles.notFound__content}>
            {/* Código do erro */}
            <span className={styles.notFound__code}>404</span>

            {/* Ícone decorativo */}
            <span className={styles.notFound__icon} aria-hidden="true">⚡</span>

            {/* Título */}
            <h1 className={styles.notFound__title}>
              Página não encontrada
            </h1>

            {/* Descrição */}
            <p className={styles.notFound__description}>
              O quadro ou a página que você está procurando não existe,
              foi movida ou foi excluída.
            </p>

            {/* Ações */}
            <div className={styles.notFound__actions}>
              <Link to="/" className={styles.notFound__btnPrimary}>
                ← Voltar para Meus Boards
              </Link>

              <button
                type="button"
                className={styles.notFound__btnGhost}
                onClick={() => window.history.back()}
              >
                Voltar uma página
              </button>
            </div>
          </div>
        </div>
      </Container>
    </MainTemplate>
  );
}