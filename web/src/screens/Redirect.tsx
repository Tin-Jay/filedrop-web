import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18not';
import { useLocation } from 'wouter';

import { Loading } from '../components/Loading.js';
import { nameCharacterSet, nameLength } from '../config.js';
import { applicationStore, connection, networkStore } from '../stores/index.js';
import { randomString } from '../utils/string.js';

export const Redirect: React.FC = observer(() => {
  const { t } = useTranslation();
  const { networkName } = networkStore;
  const suggestedNetworkName = applicationStore.suggestedNetworkName;
  const { connected, clientId } = connection;

  const navigate = useLocation()[1];

  // biome-ignore lint: Needs to run if any of these changes.
  useEffect(() => {
    const currentNetworkName = networkName || suggestedNetworkName || randomString(nameLength, nameCharacterSet);

    if (connected && clientId) {
      // Preserve the hash for automatic send from clipboard. (#paste)
      navigate(`/${currentNetworkName}${window.location.hash}`, {
        replace: true,
      });
    }
  }, [connected, networkName, navigate, clientId, suggestedNetworkName]);

  return <Loading>{t('state.loading')}</Loading>;
});
