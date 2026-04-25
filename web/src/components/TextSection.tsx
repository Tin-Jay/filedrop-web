import type React from 'react';
import { Footer } from './Footer.js';
import styles from './TextSection.module.scss';

export const TextSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className={styles.text}>{children}</div>
      <Footer />
    </>
  );
};
