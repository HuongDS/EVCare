using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.MongoDb_Message
{
    public class LastMessage
    {
        public string? Text { get; set; }
        public DateTime? SentAt { get; set; }
        public string? SenderId { get; set; }
    }
}
