import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18not';
import { IoClose } from 'react-icons/io5';
import { IconButton } from './IconButton.js';
import styles from './Modal.module.scss';
import { Portal } from './Portal.js';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <Portal isOpen={isOpen}>
      <div
        className={styles.overlay}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className={styles.modal}>
          <div className={styles.title}>
            <h2>{title}</h2>
            <IconButton title={t('close')} onClick={onClose}>
              <IoClose />
            </IconButton>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </Portal>
  );
};
