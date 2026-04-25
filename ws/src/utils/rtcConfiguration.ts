import crypto from 'crypto';
import { stunServer, turnCredential, turnExpiry, turnMode, turnSecret, turnServer, turnUsername } from '../config.js';

export const rtcConfiguration = (clientId?: string) => {
  const iceServers = [];

  iceServers.push({
    urls: stunServer,
  });

  if (turnServer && turnUsername && clientId) {
    if (turnMode === 'hmac' && turnSecret) {
      const timestamp = Math.floor(Date.now() / 1000) + turnExpiry;
      const username = `${timestamp}:${clientId}`;
      const hmac = crypto.createHmac('sha1', turnSecret);
      hmac.setEncoding('base64');
      hmac.write(username);
      hmac.end();
      iceServers.push({
        urls: turnServer,
        username: username,
        credential: hmac.read(),
      });
    } else if (turnCredential) {
      iceServers.push({
        urls: turnServer,
        username: turnUsername,
        credential: turnCredential,
      });
    }
  }

  return {
    iceServers,
  };
};
