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
        private readonly IAccountService _accountService;
        private readonly IEmployeeServices _employeeServices;

        public ConversationService(IMongoDatabase db, IStaffRoutingService route, IAccountService accountService,
            IEmployeeServices employeeServices)
        {
            _conversations = db.GetCollection<Conversation>("conversations");
            _route = route;
            _accountService = accountService;
            _employeeServices = employeeServices;
        }

        public async Task<Conversation> CreateOrGetConsultationAsync(string customerAccountId, string staffAccountId)
        {
            var type = staffAccountId == "AI_BOT" ? "AI" : "consultation";

            var conversation = Builders<Conversation>.Filter.And(
                    Builders<Conversation>.Filter.Eq(c => c.Type, type),
                    Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == customerAccountId),
                    Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == staffAccountId)
                );

            var existed = await _conversations.Find(conversation).FirstOrDefaultAsync();
            if (existed != null) return existed;

            var customerInfo = await _accountService.GetAccountById(int.Parse(customerAccountId));

            var employee = new Participant
            {
                AccountId = staffAccountId,
                Role = DataAccess.Enums.RoleEnum.Staff,
                Name = "EVCare Assistant"
            };
            if (staffAccountId != "AI_BOT")
            {
                employee.EmployeeId = (await _employeeServices.GetEmployeeIdByAccountId(int.Parse(staffAccountId))).ToString();
            }

            var newConversation = new Conversation
            {
                Type = type,
                Participants = new List<Participant>
                {
                    new Participant { AccountId = customerAccountId, Role = DataAccess.Enums.RoleEnum.Customer, Name = customerInfo.First_Name + customerInfo.Last_Name, Phone = customerInfo.Phone },
                    employee
                },
                Unread = new Dictionary<string, int>
                {
                     { customerAccountId.ToString(), 0 },
                    { staffAccountId.ToString(), 0 }
                },
            };

            if (staffAccountId != "AI_BOT" && staffAccountId != "0")
            {
                //var staffInfo = await _accountService.GetAccountById(int.Parse(staffAccountId));
                var staffInfo = await _employeeServices.GetEmployeeInformation(int.Parse(employee.EmployeeId));
                //newConversation.Participants[1].Name = staffInfo.First_Name + " " + staffInfo.Last_Name;
                newConversation.Participants[1].Name = staffInfo.FullName;
                newConversation.Participants[1].EmployeeImage = staffInfo.Avatar;
            }

            await _conversations.InsertOneAsync(newConversation);
            return newConversation;
        }

        public async Task<Conversation> StartConsultationAsync(string customerAccountId, int appointmentId)
        {
            var staffId = await _route.FindAvailableAsync(customerAccountId, appointmentId);
            if (staffId == null)
            {
                staffId = "AI_BOT";
            }

            var type = staffId == "AI_BOT" ? "AI" : "consultation";

            var conversation = Builders<Conversation>.Filter.And(
                   Builders<Conversation>.Filter.Eq(c => c.Type, type),
                   Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == customerAccountId),
                   Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == staffId)
               );

            var existed = await _conversations.Find(conversation).FirstOrDefaultAsync();
            if (existed != null) return existed;

            var customerInfo = await _accountService.GetAccountById(int.Parse(customerAccountId));

            var employee = new Participant
            {
                AccountId = staffId,
                Role = DataAccess.Enums.RoleEnum.Staff,
                Name = "EVCare Assistant"
            };
            if (staffId != "AI_BOT")
            {
                employee.EmployeeId = (await _employeeServices.GetEmployeeIdByAccountId(int.Parse(staffId))).ToString();
            }

            var newConversation = new Conversation
            {
                Type = type,
                Participants = new List<Participant>
                {
                    new Participant { AccountId = customerAccountId, Role = DataAccess.Enums.RoleEnum.Customer, Name = customerInfo.First_Name + customerInfo.Last_Name, Phone = customerInfo.Phone },
                    employee
                },
                Unread = new Dictionary<string, int>
                {
                     { customerAccountId.ToString(), 0 },
                    { staffId.ToString(), 0 }
                },
            };

            if (staffId != "AI_BOT" && staffId != "0")
            {
                var staffInfo = await _employeeServices.GetEmployeeInformation(int.Parse(employee.EmployeeId));
                newConversation.Participants[1].Name = staffInfo.FullName;
                newConversation.Participants[1].EmployeeImage = staffInfo.Avatar;
            }

            await _conversations.InsertOneAsync(newConversation);
            return newConversation;
        }

        public async Task<(List<Conversation>, int, long)> ListMineAsync(string accountId, int pageSize, int pageIndex)
        {
            var filter = Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == accountId);
            var totalItems = await _conversations.CountDocumentsAsync(filter);
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var conversations = await _conversations.Find(filter).SortByDescending(c => c.UpdatedAt)
                .Skip((pageIndex - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();
            return (conversations, totalPages, totalItems);
        }

        public async Task ResetUnreadAsync(string conversationId, string accountId)
        {
            var update = Builders<Conversation>.Update.Set($"Unread.{accountId}", 0);
            await _conversations.UpdateOneAsync(c => c.Id == conversationId, update);
        }

        public async Task<Dictionary<int, int>> GetUnreadSummaryAsync(string accountId)
        {
            var filter = Builders<Conversation>.Filter.ElemMatch(c => c.Participants, p => p.AccountId == accountId);
            var projects = Builders<Conversation>.Projection.Include(c => c.Id).Include(c => c.Unread);
            var items = await _conversations.Find(filter).Project<Conversation>(projects).ToListAsync();

            var res = new Dictionary<int, int>();
            foreach (var c in items)
            {
                if (c.Unread.TryGetValue(accountId.ToString(), out var cnt))
                    res[int.Parse(c.Id)] = cnt;
            }
            return res;
        }

        public async Task<string> GetCounterpartAsync(string conversationId, string accountId)
        {
            var c = await _conversations.Find(x => x.Id == conversationId).FirstOrDefaultAsync();
            if (c == null) throw new KeyNotFoundException("Conversation not found");
            var other = c.Participants.First(p => p.AccountId != accountId).AccountId;
            return other;
        }
    }
}
