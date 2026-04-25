import {
  type ClientModel,
  type EncryptedMessageModel,
  type InitializeMessageModel,
  type Message,
  MessageType,
  type PingMessageModel,
} from '@filedrop/types';
import { RSA } from 'matcrypt';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { TypeSocket } from 'typesocket';

import { wsServer } from '../config.js';
import { BasicEventEmitter } from '../utils/events.js';
import { randomString } from '../utils/string.js';

declare global {
  var _filedropSocket: TypeSocket<Message> | undefined;
}

export class Connection extends BasicEventEmitter<{ message: [message: Message] }> {
  clientId?: string = undefined;
  connected = false;
  remoteAddress?: string = undefined;
  publicKey?: string = undefined;
  privateKey?: string = undefined;
  disconnectReason?: string = undefined;
  alwaysSecure = false;

  clientCache: Map<string, ClientModel> = new Map();
  clients: ClientModel[] = [];

  private targetMessageQueue: Map<string, Message[]> = new Map();
  private messageQueue: Message[] = [];
  private secret = randomString(64);
  private socket = new TypeSocket<Message>(wsServer, {
    maxRetries: 0,
    retryOnClose: true,
    retryTime: 1000,
  });

  constructor() {
    super();
    makeObservable(this, {
      clientId: observable,
      connected: observable,
      remoteAddress: observable,
      publicKey: observable,
      privateKey: observable,
      disconnectReason: observable,
      alwaysSecure: observable,
      clientCache: observable,
      clients: observable,
      secure: computed,
      init: action,
      send: action,
      onConnected: action,
      onDisconnected: action,
      onMessage: action,
    });

    // Make sure we don't have any lingering connections when the app reloads.
    window._filedropSocket?.disconnect();
    window._filedropSocket = this.socket;

    this.socket.on('connected', () => this.onConnected());
    this.socket.on('disconnected', () => this.onDisconnected());
    this.socket.on('message', (message) => this.onMessage(message));

    this.init();
  }

  get secure() {
    return !!this.publicKey;
  }

  async init() {
    try {
      const keyPair = await RSA.randomKeyPair();
      runInAction(() => {
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
      });
    } catch {}

    this.socket.connect();
  }

  async send(message: Message) {
    if (!this.connected || this.socket.readyState !== 1) {
      if ('targetId' in message) {
        this.messageQueue.push(message);
      }
      return;
    }

    if ('targetId' in message) {
      const targetId = message.targetId as string;
      const target = this.clients.find((client) => client.clientId === targetId);
      if (!target) {
        if (!this.targetMessageQueue.has(targetId)) {
          this.targetMessageQueue.set(targetId, []);
        }

        this.targetMessageQueue.get(targetId)!.push(message);
        return;
      }

      const targetPublicKey = target?.publicKey;

      if (targetPublicKey) {
        try {
          const payload: string = await RSA.encryptString(targetPublicKey, JSON.stringify(message));

          const msg: EncryptedMessageModel = {
            type: MessageType.ENCRYPTED,
            targetId: message.targetId as string,
            payload,
          };

          this.socket.send(msg);
          return;
        } catch {}
      }

      if (this.alwaysSecure) {
        return;
      }
    }

    this.socket.send(message);
  }

  onConnected() {
    this.connected = true;

    const message: InitializeMessageModel = {
      type: MessageType.INITIALIZE,
      secret: this.secret,
      publicKey: this.publicKey,
    };

    this.send(message);
  }

  onDisconnected() {
    this.connected = false;
  }

  async onMessage(message: Message) {
    switch (message.type) {
      case MessageType.APP_INFO:
        this.remoteAddress = message.remoteAddress;
        this.alwaysSecure = !!this.publicKey && message.requireCrypto;
        break;
      case MessageType.DISCONNECTED:
        this.socket.disconnect();
        this.disconnectReason = message.reason || 'notSpecified';
        break;
      case MessageType.CLIENT_INFO:
        this.clientId = message.clientId;
        break;
      case MessageType.NETWORK: {
        this.clients = message.clients;

        const queuedMessages = this.messageQueue;
        this.messageQueue = [];
        for (const message of queuedMessages) {
          this.send(message);
        }

        for (const client of message.clients) {
          this.clientCache.set(client.clientId, client);
          if (this.targetMessageQueue.has(client.clientId)) {
            const queuedMessages = this.targetMessageQueue.get(client.clientId)!;
            this.targetMessageQueue.delete(client.clientId);
            for (const message of queuedMessages) {
              this.send(message);
            }
          }
        }
        break;
      }
      case MessageType.PING: {
        const pongMessage: PingMessageModel = {
          type: MessageType.PING,
          timestamp: Date.now(),
        };
        this.send(pongMessage);
        return;
      }
      case MessageType.ENCRYPTED:
        if (!this.privateKey) {
          return;
        }

        try {
          const json = JSON.parse((await RSA.decryptString(this.privateKey, message.payload))!);

          if (json?.type) {
            if (message.clientId) {
              json.clientId = message.clientId;
            }

            this.emit('message', json);
            return;
          }
        } catch {}
        break;
    }

    this.emit('message', message);
  }
}
