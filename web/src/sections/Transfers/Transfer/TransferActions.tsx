import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { IoArrowDown, IoCheckmark, IoClose } from 'react-icons/io5';
import { CopyButton } from '../../../components/CopyButton.js';
import { IconButton } from '../../../components/IconButton.js';
import type { Transfer } from '../../../stores/Transfer.js';
import styles from './TransferActions.module.scss';

interface TransferProps {
  transfer: Transfer;
}

export const TransferActions: React.FC<TransferProps> = observer(({ transfer }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.actions}>
      {transfer.canDownload && (
        <IconButton round href={transfer.blobUrl} download={transfer.fileName} title={t('download')}>
          <IoArrowDown />
        </IconButton>
      )}
      {transfer.canCopy && <CopyButton round onClick={() => transfer.copy()} className={styles.copy} />}
      {transfer.canAccept && (
        <IconButton round onClick={() => transfer.accept()} className={styles.positive} title={t('accept')}>
          <IoCheckmark />
        </IconButton>
      )}
      <IconButton round onClick={() => transfer.cancel()} className={styles.negative} title={t('cancel')}>
        <IoClose />
      </IconButton>
    </div>
  );
});
