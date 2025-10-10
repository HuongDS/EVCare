using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Review
{
    public class ReviewCreateModel
    {
        public int AppointmentId { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}
