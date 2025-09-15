using Application.IService;
using DataAccess.Dtos.File;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromHeader(Name = "FolderName")] string folderName)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new
                    {
                        statusCode = 400,
                        message = "No file uploaded",
                        data = (string?)null
                    });
                }
                var fileUploadModel = new FileUploadModel
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    FileStream = file.OpenReadStream(),
                    FolderName = folderName
                };
                var fileUrl = await _fileService.UploadImageAsync(fileUploadModel);
                return Ok(new
                {
                    statusCode = 200,
                    message = "File uploaded successfully",
                    data = fileUrl
                });

            }
            catch (Exception e)
            {
                return StatusCode(500, new { statusCode = 500, message = e.Message });

            }
           
        }
        [HttpPost("upload-multiple-images")]
        public async Task<IActionResult> UploadMultipleFiles(List<IFormFile> files, [FromHeader(Name = "FolderName")] string folderName)
        {
            return null;
            //try
            //{
            //    if (files == null || files.Count == 0)
            //    {
            //        return BadRequest(new
            //        {
            //            statusCode = 400,
            //            message = "No files uploaded",
            //            data = (string?)null
            //        });
            //    }
            //    var fileUploadModels = new List<FileUploadModel>();
            //    foreach (var file in files)
            //    {
            //        var fileUploadModel = new FileUploadModel
            //        {
            //            FileName = file.FileName,
            //            ContentType = file.ContentType,
            //            FileStream = file.OpenReadStream(),
            //            FolderName = folderName
            //        };
            //        fileUploadModels.Add(fileUploadModel);
            //    }
            ////    var fileUrls = await _fileService.UploadMultipleImagesAsync(fileUploadModels);
            //    return Ok(new
            //    {
            //        statusCode = 200,
            //        message = "Files uploaded successfully",
            //        data = fileUrls
            //    });
            //}
            //catch (Exception e)
            //{
            //    return StatusCode(500, new { statusCode = 500, message = e.Message });
            //}
        }
    }
}
