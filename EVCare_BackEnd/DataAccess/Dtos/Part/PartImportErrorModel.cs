using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Part {
    public class PartImportErrorModel {
        public int RowNumber { get; set; }
        public string Name { get; set; }
        public string CategoryName { get; set; }
        public string Description { get; set; }
        public string Price { get; set; }
        public string ReplacementPrice { get; set; }
        public string Stock { get; set; }
        public string ErrorMessage { get; set; }
    }
}
