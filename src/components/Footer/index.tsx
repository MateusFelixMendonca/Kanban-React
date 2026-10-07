import styles from './styles.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        {/* LADO ESQUERDO: Brand + Copyright */}
        <div className={styles.footer__left}>
          <span className={styles.footer__brand}>
            <span className={styles.footer__brandIcon}>⚡</span>
            <span className={styles.footer__brandText}>KanbanFlow</span>
          </span>
          <span className={styles.footer__divider}>•</span>
          <span className={styles.footer__copy}>
            &copy; {currentYear} — Plataforma de Gestão Kanban
          </span>
        </div>

        {/* LADO DIREITO: Links */}
        <nav className={styles.footer__nav} aria-label="Links do rodapé">
          <span className={styles.footer__statusBadge}>
            <span className={styles.footer__statusIndicator}></span>
            Sistemas Operacionais
          </span>
          <a href="#" className={styles.footer__link}>
            Documentação
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footer__link}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}