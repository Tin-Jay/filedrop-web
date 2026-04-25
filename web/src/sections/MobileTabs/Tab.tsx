import clsx from 'clsx';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { applicationStore } from '../../stores/index.js';
import styles from './Tab.module.scss';

interface Props {
  id: string;
}

export const Tab: React.FC<React.PropsWithChildren<Props>> = observer(({ id, children }) => {
  const isActive = applicationStore.tab === id;
  const { t } = useTranslation();

  const title = t(`tabs.${id}`);

  return (
    <button
      className={clsx(styles.tab, { [styles.active]: isActive })}
      onClick={() => runInAction(() => (applicationStore.tab = id))}
      role="tab"
      type="button"
      title={title}
    >
      <span>{children}</span>
    </button>
  );
});
