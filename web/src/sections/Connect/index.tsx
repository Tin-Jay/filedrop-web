import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18not';
import { IoSend } from 'react-icons/io5';
import { useLocation } from 'wouter';
import { CopyButton } from '../../components/CopyButton.js';
import { IconButton } from '../../components/IconButton.js';
import { applicationStore, networkStore } from '../../stores/index.js';
import { isShareSupported } from '../../utils/browser.js';
import { copy } from '../../utils/copy.js';
import { LocalNetworks } from '../LocalNetworks/index.js';
import styles from './index.module.scss';

export const ConnectSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const [location] = useLocation();

  // biome-ignore lint: Needs to be recomputed whenever location changes.
  const href = useMemo(() => window.location.href, [location]);

  return (
    <>
      <div className="subsection">
        <div className={styles.connect}>
          <div className={styles.info}>{t('connect')}</div>
          <div className={styles.qrcode}>
            <QRCodeSVG value={href} size={192} />
          </div>
          <div className={styles.share}>
            <div className={styles.copy}>
              <pre>{href}</pre>
              <div className={styles.buttons}>
                <CopyButton onClick={() => copy(href)} />
                {isShareSupported && (
                  <IconButton onClick={() => applicationStore.share(href)} title={t('share')}>
                    <IoSend />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!!networkStore.otherNetworks.length && (
        <div className={clsx('subsection', styles.other)}>
          <span>{t('localNetworks')}</span>
          <LocalNetworks />
        </div>
      )}
    </>
  );
});

export default ConnectSection;
