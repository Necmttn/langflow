export interface Memory {
  get: () => string;
  clear: () => void;
}

export * from './buffered-chat-memory';
