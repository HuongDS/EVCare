using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Application.IService;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DataAccess.Dtos.File;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.Extensions.Configuration;

namespace Application.Service
{
    public class FileService : IFileService
    {
        private readonly Cloudinary _cloudinary;
        private readonly IAmazonS3 _s3;
        private readonly string _bucket;
        private readonly string _publicBase;

        public FileService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
            var accountId = config["R2:AccountId"]!;
            var serviceUrl = config["R2:ServiceUrl"] ?? $"https://{accountId}.r2.cloudflarestorage.com";
            var accessKey = config["R2:AccessKeyId"]!;
            var secretKey = config["R2:SecretAccessKey"]!;
            _bucket = config["R2:Bucket"]!;
            _publicBase = config["R2:PublicBaseUrl"]!.TrimEnd('/');

            var s3cfg = new AmazonS3Config { ServiceURL = serviceUrl, ForcePathStyle = true };
            _s3 = new AmazonS3Client(accessKey, secretKey, s3cfg);
        }

        public virtual async Task<string> UploadImageAsync(FileUploadModel file  )
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

        public async Task<List<FileUploadResult>> UploadImagesAsync(List<FileUploadModel> fileUploadModels)
        {
           if(fileUploadModels == null || fileUploadModels.Count == 0)
            {
                throw new Exception("No files to upload");
            }
           var uploadTasks = fileUploadModels.Select( async file =>
           {
               try
               {
                   var url = await UploadImageAsync(file);
                   return new FileUploadResult
                   {
                       FileName = file.FileName,
                       Url = url,
                       ErrorMessage = null
                   };

               }
               catch (Exception ex)
               { 
                     return new FileUploadResult
                     {
                          FileName = file.FileName,
                          Url = null,
                          ErrorMessage = ex.Message
                     };
               }
                  
            
        }).ToList();
           var results = await Task.WhenAll(uploadTasks);
           return results.ToList();

        }
        private static string GetMime(string ext) => ext.ToLowerInvariant() switch
        {
            ".glb" => "model/gltf-binary",
            ".gltf" => "model/gltf+json",
            ".stl" => "model/stl",
            ".obj" => "text/plain",
            _ => "application/octet-stream"
        };
        public async Task<string> UploadModel3DAsync(FileUploadModel fileUploadModel) {
            if (fileUploadModel == null)
                throw new ArgumentNullException(nameof(fileUploadModel));
            if (string.IsNullOrWhiteSpace(fileUploadModel.FileName))
                throw new Exception("Missing FileName.");
            if (fileUploadModel.FileStream == null || !fileUploadModel.FileStream.CanRead)
                throw new Exception("Invalid FileStream.");

            var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        { ".glb", ".gltf", ".usdz", ".fbx", ".obj" };
            var extension = Path.GetExtension(fileUploadModel.FileName);
            if (string.IsNullOrWhiteSpace(extension) || !allowed.Contains(extension))
                throw new Exception("File type is not allowed");

            var folder = string.IsNullOrWhiteSpace(fileUploadModel.FolderName)
                ? "3d" : fileUploadModel.FolderName.Trim().Trim('/');
            var key = $"{folder}/{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            var contentType = !string.IsNullOrWhiteSpace(fileUploadModel.ContentType)
                ? fileUploadModel.ContentType
                : GetMime(extension);

            Stream uploadStream = fileUploadModel.FileStream;
            if (uploadStream.CanSeek) {
                uploadStream.Position = 0;
            }
            else {
                var ms = new MemoryStream();
                await fileUploadModel.FileStream.CopyToAsync(ms);
                ms.Position = 0;
                uploadStream = ms;
            }

            var put = new PutObjectRequest
            {
                BucketName = _bucket,
                Key = key,
                InputStream = uploadStream,
                ContentType = contentType,
                UseChunkEncoding = false,          
                AutoCloseStream = false            
            };

            if (uploadStream.CanSeek) {
                put.Headers.ContentLength = uploadStream.Length;
            }

            await _s3.PutObjectAsync(put);

            var displayUrl = $"{_publicBase.TrimEnd('/')}/{key}";
            return displayUrl;
        }
    }
}
