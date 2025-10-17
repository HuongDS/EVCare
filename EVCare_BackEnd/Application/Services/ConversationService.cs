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
    public class ConversationService : IConversationService
    {
        private readonly IMongoCollection<Conversation> _conversations;
        private readonly IStaffRoutingService _route;

        public ConversationService(IMongoDatabase db, IStaffRoutingService route)
        {
            _conversations = db.GetCollection<Conversation>("Conversations");
            _route = route;
        }

        public async Task<Conversation> CreateOrGetConsultationAsync(int customerAccountId, int staffAccountId)
        {
            var conversation = Builders<Conversation>.Filter.And(
                    Builders<Conversation>.Filter.Eq(c => c.Type, "consultation"),
                    Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == customerAccountId),
                    Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == staffAccountId)
                );

            var existed = await _conversations.Find(conversation).FirstOrDefaultAsync();
            if (existed != null) return existed;

            var newConversation = new Conversation
            {
                Type = "consultation",
                Participants = new List<Participant>
                {
                    new Participant { AccountId = customerAccountId, Role = DataAccess.Enums.RoleEnum.Customer },
                    new Participant { AccountId = staffAccountId, Role = DataAccess.Enums.RoleEnum.Staff }
                },
                Unread = new Dictionary<int, int>
                {
                    { customerAccountId, 0 },
                    { staffAccountId, 0 }
                },
            };

            await _conversations.InsertOneAsync(newConversation);
            return newConversation;
        }

        public async Task<Conversation> StartConsultationAsync(int customerAccountId)
        {
            var staffId = await _route.FindAvailableAsync();

            var conversation = new Conversation
            {
                Type = "consultation",
                Participants = new List<Participant>
                {
                    new Participant { AccountId = customerAccountId, Role = DataAccess.Enums.RoleEnum.Customer },
                    new Participant { AccountId = staffId, Role = DataAccess.Enums.RoleEnum.Staff }
                },
                Unread = new Dictionary<int, int>
                {
                    { customerAccountId, 0 },
                    { staffId, 0 }
                },
            };

            await _conversations.InsertOneAsync(conversation);
            return conversation;
        }

        public async Task<(IEnumerable<Conversation>, int, int)> ListMineAsync(int accountId, int pageSize, int pageIndex)
        {
            var filter = Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == accountId);
            var conversations = await _conversations.Find(filter)
                .ToListAsync();
            var totalPages = (int)Math.Ceiling((double)conversations.Count / pageSize);
            var totalItems = conversations.Count;
            return (conversations, totalPages, totalItems);
        }

        public async Task ResetUnreadAsync(int conversationId, int accountId)
        {
            var update = Builders<Conversation>.Update.Set($"Unread.{accountId}", 0);
            await _conversations.UpdateOneAsync(c => c.Id == conversationId, update);
        }

        public async Task<Dictionary<int, int>> GetUnreadSummaryAsync(int accountId)
        {
            var filter = Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == accountId);
            var projects = Builders<Conversation>.Projection.Include(c => c.Id).Include(c => c.Unread);
            var items = await _conversations.Find(filter).Project<Conversation>(projects).ToListAsync();

            var res = new Dictionary<int, int>();
            foreach (var c in items)
            {
                if (c.Unread.TryGetValue(accountId, out var cnt))
                    res[c.Id] = cnt;
            }
            return res;
        }

        public async Task<int> GetCounterpartAsync(int conversationId, int accountId)
        {
            var c = await _conversations.Find(x => x.Id == conversationId).FirstOrDefaultAsync();
            if (c == null) throw new KeyNotFoundException("Conversation not found");
            var other = c.Participants.First(p => p.AccountId != accountId).AccountId;
            return other;
        }
    }
}
