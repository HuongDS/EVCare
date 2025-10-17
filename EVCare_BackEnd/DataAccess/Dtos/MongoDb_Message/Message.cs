using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccess.Dtos.MongoDb_Message
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ConversationId { get; set; }
        public string SenderId { get; set; } = default!;
        public string ReceiverId { get; set; } = default!;
        public string Type { get; set; } = "text";
        public string? Text { get; set; }
        public List<Attachment>? Attachments { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public DateTime? EditedAt { get; set; }
        public Dictionary<string, string>? Meta { get; set; }
    }
}
