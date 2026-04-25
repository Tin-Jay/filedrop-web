import { observer } from 'mobx-react-lite';
import type React from 'react';
import type { Transfer } from '../../stores/Transfer.js';
import { Actions } from './Actions.js';
import styles from './Queue.module.scss';
import { Total } from './Total.js';
import { TransferInfo } from './Transfer/index.js';

interface Props {
  transfers: Transfer[];
  title: string;
  showTotal?: boolean;
}

export const Queue: React.FC<Props> = observer(({ transfers, title, showTotal }) => {
  return (
    <>
      {transfers.length > 0 && (
        <div className="subsection">
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <Actions transfers={transfers} />
          </div>
          <ul className={styles.queue}>
            {showTotal && <Total transfers={transfers} />}
            {transfers.map((transfer) => (
              <TransferInfo key={transfer.transferId} transfer={transfer} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
});
