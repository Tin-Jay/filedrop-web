import type React from 'react';
import { useTranslation } from 'react-i18not';
import { IoCheckmarkDone, IoClose } from 'react-icons/io5';
import { IconButton } from '../../components/IconButton.js';
import type { Transfer } from '../../stores/Transfer.js';
import styles from './Actions.module.scss';

interface Props {
  transfers: Transfer[];
}

export const Actions: React.FC<Props> = ({ transfers }) => {
  const { t } = useTranslation();

  if (transfers.length <= 1) {
    return null;
  }

  const acceptAll = () => {
    for (const transfer of transfers) {
      transfer.accept();
    }
  };
  const cancelAll = () => {
    for (const transfer of transfers) {
      transfer.cancel();
    }
  };

  const hasAcceptable = transfers.some((transfer) => transfer.canAccept);

  return (
    <div className={styles.actions}>
      {hasAcceptable && (
        <IconButton round onClick={acceptAll} title={t('acceptAll')}>
          <IoCheckmarkDone />
        </IconButton>
      )}
      <IconButton round onClick={cancelAll} title={t('cancelAll')}>
        <IoClose />
      </IconButton>
    </div>
  );
};
