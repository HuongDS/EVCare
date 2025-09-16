using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.File
{
    public class FileUploadResult
    {
        public string FileName { get; set; }
        public string? Url { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
