using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.MongoDb_Message;

namespace Application.Interfaces
{
    public interface IChatServices
    {
        Task<List<Message>> GetHistoryAsync(string conversationId, int skip, int take);
        Task MarkAsReadUpToAsync(string conversationId, string readerId, string upToMessageId);
        Task<Message> SaveMessageAsync(string conversationId, string senderId, string text, List<Attachment> atts);
    }
}
