import type Attachment from "./Attachment ";

export type HistoryMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  attachments: Attachment[];
  sentAt: string;
};
