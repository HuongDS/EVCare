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
        Task<List<Message>> GetHistoryAsync(int conversationId, int skip, int take);
        Task MarkAsReadUpToAsync(int conversationId, int readerId, int upToMessageId);
        Task<Message> SaveMessageAsync(int conversationId, int senderId, string text, List<Attachment> atts);
    }
}
