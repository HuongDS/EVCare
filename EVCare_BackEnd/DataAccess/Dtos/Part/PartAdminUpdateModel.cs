using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part
{
    public class PartAdminUpdateModel
    {
        public string Name
        {
            get;
            set;
        }
        public string Description
        {
            get;
            set;
        }
        public decimal Price
        {
            get;
            set;
        }
        public decimal ReplacementPrice
        {
            get;
            set;
        }
        public int Stock
        {
            get;
            set;
        }
        public string Image
        {
            get;
            set;
        }
        public int CategoryId
        {
            get;
            set;
        }


    }
}
