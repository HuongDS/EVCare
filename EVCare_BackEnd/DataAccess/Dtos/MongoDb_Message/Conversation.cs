using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccess.Dtos.MongoDb_Message
{
    public class Conversation
    {
        public int Id { get; set; }
        public string Type { get; set; } = "consultation";
        public List<Participant> Participants { get; set; } = new();
        public string? AssignedTo { get; set; }
        public string Status { get; set; } = "active"; // active | closed

        public Dictionary<int, int> Unread { get; set; } = new();
        public LastMessage LastMessage { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    }
}
