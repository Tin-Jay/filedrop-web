import clsx from 'clsx';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';

import { Toggle } from '../../components/Toggle.js';
import { settingsStore } from '../../stores/index.js';

export const SettingsSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const settings = settingsStore.settings;

  return (
    <div className={clsx('subsection')}>
      {settingsStore.keys.map((key) => (
        <Toggle
          key={key}
          label={t(`settings.${key}`)}
          value={settings[key]}
          onChange={(value) => runInAction(() => (settings[key] = value))}
        />
      ))}
    </div>
  );
});
