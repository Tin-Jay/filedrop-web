import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18not';
import { CopyButton } from '../../components/CopyButton.js';
import { TargetTile } from '../../components/TargetTile.js';
import { connection } from '../../stores/index.js';
import type { ChatItemModel } from '../../types/Models.js';
import { copy } from '../../utils/copy.js';
import styles from './ChatItem.module.scss';

export interface ChatItemProps {
  item: ChatItemModel;
  compact?: boolean;
}

const Urlify: React.FC<{ children: string }> = ({ children }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return children.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        // biome-ignore lint: Index is fine.
        <a href={part} key={i}>
          {part}
        </a>
      );
    }

    return part;
  });
};

export const ChatItem: React.FC<ChatItemProps> = observer(({ item, compact }) => {
  const { t, language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const client = connection.clientCache.get(item.clientId);

  useLayoutEffect(() => {
    if (messageRef.current!.offsetHeight < 50) {
      setExpanded(true);
    }
  }, []);

  return (
    <li
      className={clsx(styles.item, {
        [styles.expanded]: expanded,
        [styles.compact]: compact,
      })}
    >
      {!compact && (
        <div className={styles.info}>
          <div className={styles.left}>
            {client && <TargetTile client={client} />}
            <div>{client?.clientName}</div>
          </div>
          <div className={styles.right}>
            <div>{item.date.toLocaleTimeString(language, { timeStyle: 'short' })}</div>
          </div>
        </div>
      )}
      <div className={styles.message} ref={messageRef}>
        <Urlify>{item.message}</Urlify>
        <div className={styles.actions}>
          <CopyButton onClick={() => copy(item.message)} />
        </div>
      </div>
      {!expanded && (
        <button className={styles.more} onClick={() => setExpanded(true)}>
          {t('chat.showMore')}
        </button>
      )}
    </li>
  );
});
