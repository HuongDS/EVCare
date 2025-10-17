import type Attachment from "./Attachment ";

export type HistoryMessage = {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  attachments: Attachment[];
  sentAt: string;
};
