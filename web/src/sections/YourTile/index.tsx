import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { IoQrCode, IoSettings } from 'react-icons/io5';
import { IconButton } from '../../components/IconButton.js';
import { TargetTile } from '../../components/TargetTile.js';
import { applicationStore, networkStore } from '../../stores/index.js';
import { ClientName } from './ClientName.js';
import styles from './index.module.scss';

export const YourTileSection: React.FC = observer(() => {
  const client = networkStore.currentClient;
  const { t } = useTranslation();

  return (
    <div className="subsection">
      <div className={styles.you}>
        {client ? <TargetTile variant="medium" client={client} /> : <div></div>}
        <div className={styles.info}>
          <ClientName />
        </div>
        <div className={clsx(styles.actions, 'mobileHidden')}>
          <IconButton onClick={() => applicationStore.openModal('connect')} title={t('tabs.connect')}>
            <IoQrCode />
          </IconButton>
          <IconButton onClick={() => applicationStore.openModal('settings')} title={t('tabs.settings')}>
            <IoSettings />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
