using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using DataAccess.Dtos.MongoDb_Message;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Application.Services
{
    public class ChatServices : IChatServices
    {
        private IMongoCollection<Message> _msg;
        private IMongoCollection<Conversation> _conv;

        public ChatServices(IMongoDatabase mongoDb)
        {
            _msg = mongoDb.GetCollection<Message>("messages");
            _conv = mongoDb.GetCollection<Conversation>("conversations");
        }

        public async Task<Message> SaveMessageAsync(string conversationId, string senderId, string text, List<Attachment> atts)
        {
            var conv = await _conv.Find(c => c.Id == conversationId).FirstOrDefaultAsync();
            if (conv == null) throw new Exception("Conversation not found");

            var msg = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                ReceiverId = "",
                Text = text,
                Attachments = atts,
                SentAt = DateTime.UtcNow
            };

            if (conv.Type == "AI")
            {
                msg.ReceiverId = "AI_BOT";
            }
            else
            {
                var receiverId = conv.Participants.FirstOrDefault(p => p.AccountId != senderId)?.AccountId;
                if (receiverId == null) throw new Exception("Receiver not found");
                msg.ReceiverId = receiverId;

                if (conv.Unread.ContainsKey(receiverId))
                {
                    conv.Unread[receiverId]++;
                }
                else
                {
                    conv.Unread[receiverId] = 1;
                }
            }

            await _msg.InsertOneAsync(msg);

            // Update conversation's last message and unread count
            conv.LastMessage = new LastMessage
            {
                Text = text,
                SentAt = msg.SentAt,
                SenderId = senderId
            };
            conv.UpdatedAt = DateTime.UtcNow;
            var update = Builders<Conversation>.Update
                .Set(c => c.LastMessage, conv.LastMessage)
                .Set(c => c.Unread, conv.Unread)
                .Set(c => c.UpdatedAt, conv.UpdatedAt);
            await _conv.UpdateOneAsync(c => c.Id == conversationId, update);
            return msg;
        }

        public async Task<List<Message>> GetHistoryAsync(string conversationId, int skip, int take)
        {
            return await _msg.Find(m => m.ConversationId == conversationId)
                .SortByDescending(m => m.SentAt)
                .Skip(skip)
                .Limit(take)
                .ToListAsync();
        }

        public async Task MarkAsReadUpToAsync(string conversationId, string readerId, string upToMessageId)
        {
            var update = Builders<Conversation>.Update.Set($"Unread.{readerId}", 0);
            await _conv.UpdateOneAsync(c => c.Id == conversationId, update);
        }

        public async Task<Conversation?> GetConversationAsync(string convId)
        {
            var conv = await _conv.Find(c => c.Id == convId).FirstOrDefaultAsync();
            return conv;
        }
    }
}