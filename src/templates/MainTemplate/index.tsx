import { Footer } from '../../components/Footer';
import { TopBar } from '../../components/TopBar';
import styles from './styles.module.css'

type MainTemplateProps = {
  children: React.ReactNode;
};

export function MainTemplate({ children }: MainTemplateProps) {
  return (
    <div className={styles.layout}>
      <TopBar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
