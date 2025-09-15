using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.IService;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DataAccess.Dtos.File;
using Microsoft.Extensions.Configuration;

namespace Application.Service
{
    public class FileService : IFileService
    {
        private readonly Cloudinary _cloudinary;

        public FileService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(FileUploadModel file  )
        {
            if(file == null || file.FileStream == null || file.FileStream.Length == 0)
            {
                throw new Exception("File is null or empty");
            }
            var allowTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowTypes.Contains(file.ContentType.ToLower())){
                throw new Exception("File type is not allowed");
            }
            if(file.FileStream.Length > 5 * 1024 * 1024)
            {
                throw new Exception("File size exceeds the limit of 5MB");
            }
            var extension = Path.GetExtension(file.FileName).ToLower();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            if (!allowedExtensions.Contains(extension))
            {
                throw new Exception("Invalid file extension" );
            }


            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, file.FileStream),
                PublicId = Guid.NewGuid().ToString(),
                Folder = file.FolderName
            };
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if(uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return uploadResult.SecureUrl.ToString();
            }
            throw new Exception("Upload failed");

        }
    }
}
