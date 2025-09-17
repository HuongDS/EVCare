using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Dtos.File
{
    public class FileUploadModel
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream FileStream { get; set; }
        public string FolderName { get; set; }
    }
}
