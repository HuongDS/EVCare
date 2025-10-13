using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Service;

namespace DataAccess.Dtos.Review
{
    public class ReviewViewDetailModel
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CustomerName { get; set; }
        public List<ServiceViewFormModel> Services { get; set; }


    }
}
