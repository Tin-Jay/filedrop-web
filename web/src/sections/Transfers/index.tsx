import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { networkStore } from '../../stores/index.js';
import { Queue } from './Queue.js';

export const TransfersSection: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <>
      <Queue transfers={networkStore.incomingTransfers} title={t('transfers.title.incoming')} />
      <Queue transfers={networkStore.outgoingTransfers} title={t('transfers.title.outgoing')} />
      <Queue transfers={networkStore.activeTransfers} title={t('transfers.title.active')} />
      <Queue transfers={networkStore.doneTransfers} title={t('transfers.title.complete')} />
    </>
  );
});
