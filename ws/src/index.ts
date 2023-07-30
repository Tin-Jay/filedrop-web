import dotenv from 'dotenv-flow';
dotenv.config();

import { resolve } from 'path';
import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyStatic from '@fastify/static';
import fastifyHttpProxy from '@fastify/http-proxy';

import { WSClient } from './WSClient';
import { ClientManager, maxSize } from './ClientManager';
import { isMessageModel } from './utils/validation';

const useProxy = process.env.WS_USE_PROXY === '1';

const clientManager = new ClientManager();
const app = Fastify();

if (useProxy) {
  app.register(fastifyHttpProxy, {
    upstream: 'http://localhost:3000/',
  });
} else {
  const STATIC_ROOT = resolve('../web/build');

  app.setNotFoundHandler((_, reply) => {
    reply.sendFile('index.html', STATIC_ROOT);
  });
  app.register(fastifyStatic, {
    root: STATIC_ROOT,
    prefix: '/',
    index: 'index.html',
  });
}

app.register(fastifyWebsocket);
app.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const ws = connection.socket;
    const client = new WSClient(ws, req);
    clientManager.addClient(client);

    ws.on('error', error => {
      console.log('[ERROR (Handled)]', error.message);
    });

    ws.on('message', (data: string) => {
      // Prevents DDoS and abuse.
      if (!data || data.length > maxSize) return;

      try {
        const message = JSON.parse(data);

        if (isMessageModel(message)) {
          clientManager.handleMessage(client, message);
        }
      } catch (e) {}
    });

    ws.on('close', () => {
      clientManager.removeClient(client);
    });
  });
});

// Configuration
const host = process.env.WS_HOST || '127.0.0.1';
const port = parseInt(process.env.WS_PORT || '5000');

app.listen({ host, port });

setInterval(() => {
  clientManager.removeBrokenClients();
}, 1000);

// Ping clients to keep the connection alive (when behind nginx)
setInterval(() => {
  clientManager.pingClients();
}, 5000);

setInterval(() => {
  clientManager.removeInactiveClients();
}, 10000);

console.log(`Server running on ${host}:${port}`);