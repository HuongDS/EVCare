using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.Invoice
{
    public class InvoiceQueryDto
    {
        public int pageSize { get; set; }
        public int pageIndex { get; set; }
    }
}
