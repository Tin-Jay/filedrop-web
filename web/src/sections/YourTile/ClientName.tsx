import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18not';
import { IoCheckmark, IoPencil } from 'react-icons/io5';
import { IconButton } from '../../components/IconButton.js';
import { networkStore } from '../../stores/index.js';
import styles from './ClientName.module.scss';

export const ClientName: React.FC = observer(() => {
  const { t } = useTranslation();
  const clientName = networkStore.clientName;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(clientName);

  if (!clientName) {
    return null;
  }

  const onEdit = () => {
    setName(clientName);
    setIsEditing(true);
  };

  const onSave = () => {
    setIsEditing(false);

    if (name) {
      networkStore.updateClientName(name);
    }
  };

  return (
    <div className={styles.wrapper}>
      {!isEditing ? (
        <div onClick={onEdit} className={clsx(styles.name, styles.view)}>
          <strong>{clientName}</strong>
          <IconButton title={t('edit')}>
            <IoPencil />
          </IconButton>
        </div>
      ) : (
        <div className={clsx(styles.name, styles.edit)}>
          <input
            type="text"
            placeholder={t('yourName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
          />
          <IconButton onClick={onSave} title={t('save')}>
            <IoCheckmark />
          </IconButton>
        </div>
      )}
    </div>
  );
});
