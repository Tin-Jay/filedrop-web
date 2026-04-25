import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { connection } from '../stores/index.js';
import styles from './Status.module.scss';

export const Status: React.FC = observer(() => {
  const { t } = useTranslation();

  return !connection.connected && !connection.disconnectReason ? (
    <div className={clsx(styles.status, styles.error)}>
      <div>{t('state.connecting')}</div>
    </div>
  ) : null;
});
