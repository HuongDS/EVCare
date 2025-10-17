import type { Participants } from "./Participants";

export type Conversation = {
  id: number;
  type: string;
  lastMessage: string;
  updateAt: string;
  unread: Record<number, number>;
  participants: Participants[];
};
