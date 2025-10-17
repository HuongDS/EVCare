using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.MongoDb_Message;
using MongoDB.Driver;

namespace Application.MongoDb
{
    public static class Indexes
    {
        public async static Task CreateIndexes(IMongoDatabase db)
        {
            var conversation = db.GetCollection<Conversation>("Conversations");
            var message = db.GetCollection<Message>("Messages");

            // Conversation: participants.userId + updatedAt
            var conversationIndex = Builders<Conversation>.IndexKeys
                .Ascending("Participants.UserId")
                .Descending(c => c.UpdatedAt);
            await conversation.Indexes.CreateOneAsync(new CreateIndexModel<Conversation>(conversationIndex));

            // Message: conversationId + SentAt
            var messageIndex = Builders<Message>.IndexKeys
                .Ascending(m => m.ConversationId)
                .Ascending(m => m.SentAt);
            await message.Indexes.CreateOneAsync(new CreateIndexModel<Message>(messageIndex));
        }
    }
}
