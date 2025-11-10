using Application.Dtos;
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
            try
            {
                var fileUploadModels = files.Select(files => new FileUploadModel
                {
                    FileName = files.FileName,
                    ContentType = files.ContentType,
                    FileStream = files.OpenReadStream(),
                    FolderName = folderName
                }).ToList();
                var result = await _fileService.UploadImagesAsync(fileUploadModels);

                return Ok(new
                {
                    statusCode = 200,
                    message = "Files uploaded successfully",
                    data = result
                });
            }
            catch (Exception e)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = e.Message

                });
            }
            
           
        }


        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = 512 * 1024 * 1024)]
        [HttpPost("model3d")]
        public async Task<IActionResult> UploadModel3D(IFormFile file) { 
           
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
                    FolderName = "3dmodels"
                };
                var fileUrl = await _fileService.UploadModel3DAsync(fileUploadModel);
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

     }
}
