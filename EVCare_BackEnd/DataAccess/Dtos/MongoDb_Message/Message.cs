using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccess.Dtos.MongoDb_Message
{
    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderId { get; set; } = default!;
        public int ReceiverId { get; set; } = default!;
        public string Type { get; set; } = "text";
        public string? Text { get; set; }
        public List<Attachment>? Attachments { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public DateTime? EditedAt { get; set; }
        public Dictionary<string, string>? Meta { get; set; }
    }
}
