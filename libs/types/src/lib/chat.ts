export type Chat = {
  id: string
  title: string,
  createdAt: string
}

export type ChatMessage = {
  id: string;
  chatId: string;
  message: string;
  from?: 'system';
  files: string[]
  createdAt: string;
};
