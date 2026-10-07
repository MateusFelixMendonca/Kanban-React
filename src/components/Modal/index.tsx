import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import styles from './styles.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export function Modal({ isOpen, onClose, onCreate }: ModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) setTitle('');
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Criar novo Board</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.input}
            placeholder="Nome do board..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.btnGhost}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}