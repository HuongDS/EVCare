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
        Task<Conversation> CreateOrGetConsultationAsync(int customerAccountId, int staffAccountId);
        Task<int> GetCounterpartAsync(int conversationId, int accountId);
        Task<Dictionary<int, int>> GetUnreadSummaryAsync(int accountId);
        Task<(List<Conversation>, int, int)> ListMineAsync(int accountId, int pageSize, int pageIndex);
        Task ResetUnreadAsync(int conversationId, int accountId);
        Task<Conversation> StartConsultationAsync(int customerAccountId);
    }
}
