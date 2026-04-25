import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { applicationStore } from '../../stores/index.js';
import styles from './index.module.scss';

export const NoticeSection: React.FC = observer(() => {
  const { noticeText, noticeUrl } = applicationStore;

  if (!noticeText) {
    return null;
  }

  return (
    <div className={clsx('subsection', styles.notice)}>
      {noticeUrl ? <a href={noticeUrl}>{noticeText}</a> : noticeText}
    </div>
  );
});
