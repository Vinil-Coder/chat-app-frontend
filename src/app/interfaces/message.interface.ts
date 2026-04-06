export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;

  deliveredTo: string[];
  readBy: string[];

  createdAt: string;
}