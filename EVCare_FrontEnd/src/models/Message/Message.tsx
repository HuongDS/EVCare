import type Attachment from "./Attachment ";

export default interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  type: "text";
  text?: string | null;
  attachments?: Attachment[];
  sentAt: string;
  editedAt?: string | null;
  meta?: Record<string, string>;
}
