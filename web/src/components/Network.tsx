import type { ClientModel } from '@filedrop/types';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { networkStore } from '../stores/index.js';
import styles from './Network.module.scss';
import { NetworkTile } from './NetworkTile.js';

interface NetworkProps {
  onSelect?: (clientId: string) => void;
  icon?: React.ReactNode;
}

export const Network: React.FC<NetworkProps> = observer(({ onSelect, icon }) => {
  const everyoneClient: ClientModel = {
    clientId: 'everyone',
    isLocal: false,
    clientName: 'Everyone',
  };
  const clients = networkStore.clients;

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className={styles.network}>
      {clients.length > 1 && <NetworkTile client={everyoneClient} onSelect={onSelect} icon={icon} />}
      {clients.map((client) => (
        <NetworkTile key={client.clientId} client={client} onSelect={onSelect} icon={icon} />
      ))}
    </div>
  );
});
