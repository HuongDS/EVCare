import type { LastMessage } from "./LastMessage";
import type { Participants } from "./Participants";

export type Conversation = {
  id: string;
  type: string;
  lastMessage: LastMessage;
  updateAt: string;
  unread: Record<number, number>;
  participants: Participants[];
};
