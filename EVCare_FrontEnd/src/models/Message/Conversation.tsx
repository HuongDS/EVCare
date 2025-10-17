import type { Participants } from "./Participants";

export type Conversation = {
  id: string;
  type: string;
  lastMessage: string;
  updateAt: string;
  unread: Record<number, number>;
  participants: Participants[];
};
