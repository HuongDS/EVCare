using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.MongoDb_Message;

namespace Application.Interfaces
{
    public interface IConversationService
    {
        Task<Conversation> CreateOrGetConsultationAsync(string customerAccountId, string staffAccountId);
        Task<string> GetCounterpartAsync(string conversationId, string accountId);
        //Task<Dictionary<int, int>> GetUnreadSummaryAsync(string accountId);
        Task<(List<Conversation>, int, long)> ListMineAsync(string accountId, int pageSize, int pageIndex);
        //Task ResetUnreadAsync(string conversationId, string accountId);
        Task<Conversation> StartConsultationAsync(string customerAccountId, int appointmentId);
    }
}
