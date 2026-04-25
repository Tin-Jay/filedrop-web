import { observer } from 'mobx-react-lite';
import type React from 'react';
import { IoChatbubbles, IoHome, IoQrCode, IoSettings } from 'react-icons/io5';
import { NotificationCount } from '../../components/NotificationCount.js';
import { chatStore, networkStore } from '../../stores/index.js';
import styles from './index.module.scss';
import { Tab } from './Tab.js';

export const MobileTabs: React.FC = observer(() => {
  return (
    <div className={styles.tabs} role="tablist">
      {/* This is a hack to get Safari's toolbar to have the proper background color. */}
      <div className={styles.background} />
      <Tab id="transfers">
        <NotificationCount count={networkStore.incomingTransfers.length} />
        <IoHome />
      </Tab>
      <Tab id="connect">
        <IoQrCode />
      </Tab>
      <Tab id="chat">
        <NotificationCount count={chatStore.unread} />
        <IoChatbubbles />
      </Tab>
      <Tab id="settings">
        <IoSettings />
      </Tab>
    </div>
  );
});
