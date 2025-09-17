using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class ResponseDto<T>
    {
        public int statusCode { get; set; }
        public string message { get; set; }
        public T? data { get; set; }
    }
}
