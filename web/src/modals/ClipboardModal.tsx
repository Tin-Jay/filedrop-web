import React from 'react';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';
import { IoCloseSharp } from 'react-icons/io5/index.js';

import styles from './ClipboardModal.module.scss';
import { animationPropsOpacity } from '../animationSettings.js';
import { Network } from '../components/Network.js';
import { IconButton } from '../components/IconButton.js';
import { networkStore } from '../stores/index.js';
import { observer } from 'mobx-react-lite';

interface ClipboardModalProps {
  files: File[];
  dismissClipboard: () => void;
}

export const ClipboardModal: React.FC<ClipboardModalProps> = observer(
  ({ files, dismissClipboard }) => {
    const { t } = useTranslation();
    const fileNames = files.map((file, i) => file.name).join(', ');
    const clients = networkStore.clients;

    const onSelect = (clientId: string) => {
      for (let file of files) {
        networkStore.createTransfer(file, clientId);
      }

      dismissClipboard();
    };

    return (
      <motion.div
        className={styles.modal}
        onClick={dismissClipboard}
        {...animationPropsOpacity}
      >
        <div className="subsection" onClick={e => e.stopPropagation()}>
          <h2>
            {t('clipboard.title')}
            <IconButton onClick={dismissClipboard} title={t('close')}>
              <IoCloseSharp />
            </IconButton>
          </h2>
          <p>{t('clipboard.body', { fileNames })}</p>
          <Network onSelect={onSelect} />
          {clients.length === 0 && <div>{t('emptyNetwork.title')}</div>}
        </div>
      </motion.div>
    );
  }
);
