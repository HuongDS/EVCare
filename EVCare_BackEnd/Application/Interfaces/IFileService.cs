using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.File;

namespace Application.IService
{
    public interface IFileService
    {
        public Task<string> UploadImageAsync(FileUploadModel file);
        public Task<List<FileUploadResult>> UploadImagesAsync(List<FileUploadModel> fileUploadModels);
    }
}
