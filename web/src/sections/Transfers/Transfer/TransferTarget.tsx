import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import {
  IoArrowDown,
  IoArrowUp,
  IoCaretDown,
  IoCaretUp,
  IoCheckmark,
  IoClose,
  IoHourglassOutline,
  IoLink,
} from 'react-icons/io5';
import { TargetTile } from '../../../components/TargetTile.js';
import { Tooltip } from '../../../components/Tooltip.js';
import { connection } from '../../../stores/index.js';
import type { Transfer } from '../../../stores/Transfer.js';
import { TransferState } from '../../../types/TransferState.js';
import styles from './TransferTarget.module.scss';

interface TransferIconProps {
  transfer: Transfer;
}

const stateIcon = (state: TransferState, receiving: boolean) => {
  switch (state) {
    case TransferState.INCOMING:
      return <IoArrowDown />;
    case TransferState.OUTGOING:
      return <IoArrowUp />;
    case TransferState.FAILED:
      return <IoClose />;
    case TransferState.IN_PROGRESS:
      if (receiving) {
        return <IoCaretDown />;
      } else {
        return <IoCaretUp />;
      }
    case TransferState.CONNECTING:
      return <IoHourglassOutline />;
    case TransferState.CONNECTED:
      return <IoLink />;
    case TransferState.COMPLETE:
      return <IoCheckmark />;
  }
};

export const TransferTarget: React.FC<TransferIconProps> = observer(({ transfer }) => {
  const { t } = useTranslation();
  const targetClient = connection.clientCache.get(transfer.targetId);

  if (!targetClient) {
    return null;
  }

  return (
    <Tooltip content={t(`transferState.${transfer.state}`)}>
      <TargetTile
        className={styles.tile}
        client={targetClient}
        title={t('transfers.icon.state', {
          state: t(`transferState.${transfer.state}`),
        })}
      >
        {stateIcon(transfer.state, transfer.receiving)}
      </TargetTile>
    </Tooltip>
  );
});
