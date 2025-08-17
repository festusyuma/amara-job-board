export type Chat = {
  id: string
  createdAt: string
  updateAt: string
}

export type ChatMessage = {
  id: string;
  chatId: string;
  message: string;
  from?: 'system';
  files: string[]
  createdAt: string;
};
