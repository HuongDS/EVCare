using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Application.Service;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DataAccess.Dtos.File;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;

namespace Application.Tests {
    public class FlieServiceTests {
        private readonly IFixture _fixture;
        public FlieServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }

        public FileService CreateFileService() {

            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.SetupGet(x => x["Cloudinary:CloudName"]).Returns("abc");
            configMock.SetupGet(x => x["Cloudinary:ApiKey"]).Returns("123");
            configMock.SetupGet(x => x["Cloudinary:ApiSecret"]).Returns("456");
            configMock.SetupGet(x => x["R2:AccountId"]).Returns("acc");
            configMock.SetupGet(x => x["R2:AccessKeyId"]).Returns("ak");
            configMock.SetupGet(x => x["R2:SecretAccessKey"]).Returns("sk");
            configMock.SetupGet(x => x["R2:Bucket"]).Returns("bucket");
            configMock.SetupGet(x => x["R2:PublicBaseUrl"]).Returns("https://cdn.com");

            var fileService = new FileService(configMock.Object);
            return fileService;
        }
        [Fact]
        public async Task UploadImageAsync_WithFileIsNull_ThrowsException() {

            var fileService = CreateFileService();
            FileUploadModel file = null;
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File is null or empty", result.Message);
        }
        [Fact]
        public async Task UploadImageAsync_WithFileStreamIsNull_ThrowsException() {
            var fileService = CreateFileService();
            var file = new FileUploadModel
            {
                FileName = "test.jpg",
                ContentType = "image/jpg",
                FileStream = null
            };
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File is null or empty", result.Message);
        }
        [Fact]
        public async Task UploadImageAsync_WithFileStreamLengthEqualsZero_ThrowsException() {
            var fileService = CreateFileService();
            var file = new FileUploadModel
            {
                FileName = "test.jpg",
                ContentType = "image/jpg",
                FileStream = new MemoryStream()
            };
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File is null or empty", result.Message);
        }
        [Fact]
        public async Task UploadImageAsync_WithValidFileWithoutFakeCreti_ThrowsException() {
            var fileService = CreateFileService();
            var file = new FileUploadModel
            {
                FileName = "test.jpg",
                ContentType = "image/png",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content"))
            };
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("Upload failed", result.Message);

        }
        [Fact]
        public async Task UploadImageAsync_WihtInvalidContentType_ThrowsException() {
            var fileService = CreateFileService();
            var file = new FileUploadModel
            {
                FileName = "test.txt",
                ContentType = "text/plain",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy text content"))
            };
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File type is not allowed", result.Message);
        }
        [Fact]
        public async Task UploadImageAsync_WithInvalidSize_ThrowsException() {
            var fileService = CreateFileService();
            var largeContent = new byte[6 * 1024 * 1024];
            var file = new FileUploadModel
            {
                FileName = "large_image.jpg",
                ContentType = "image/png",
                FileStream = new MemoryStream(largeContent)
            };
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File size exceeds the limit of 5MB", result.Message);
        }
        [Fact]
        public async Task UploadImageAsync_WithInValidExtension_ThrowsException() {
            var fileService = CreateFileService();
            var file = new FileUploadModel
            {
                FileName = "test.text",
                ContentType = "image/png",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content"))
            };
         
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("Invalid file extension", result.Message);
        }
        [Fact]
        public async Task UploadImagesAsync_WithEmptyList_ThrowsException() {
            var fileService = CreateFileService();
            var files = new List<FileUploadModel>();
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImagesAsync(files));
            Assert.Equal("No files to upload", result.Message);
        }
        [Fact]
        public async Task UploadImagesAsync_WithFileIsNull_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = null;
            var result = await Assert.ThrowsAsync<Exception>(async () => await fileService.UploadImageAsync(file));
            Assert.Equal("File is null or empty", result.Message);
        }
        [Fact]
        public async Task UploadImagesAsync_WithOneVaildFileAndOneInvalidFile_ReturnsListUrlFile() {
            var configMock = _fixture.Freeze<Mock<IConfiguration>>();
            configMock.SetupGet(x => x["Cloudinary:CloudName"]).Returns("abc");
            configMock.SetupGet(x => x["Cloudinary:ApiKey"]).Returns("123");
            configMock.SetupGet(x => x["Cloudinary:ApiSecret"]).Returns("456");
            configMock.SetupGet(x => x["R2:AccountId"]).Returns("acc");
            configMock.SetupGet(x => x["R2:AccessKeyId"]).Returns("ak");
            configMock.SetupGet(x => x["R2:SecretAccessKey"]).Returns("sk");
            configMock.SetupGet(x => x["R2:Bucket"]).Returns("bucket");
            configMock.SetupGet(x => x["R2:PublicBaseUrl"]).Returns("https://cdn.com");
            var files = new List<FileUploadModel>
            {
                new FileUploadModel
                {
                    FileName = "test1.jpg",
                    ContentType = "image/png",
                    FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content 1"))
                },
                new FileUploadModel
                {
                    FileName = "test2.jpg",
                    ContentType = "image/jpeg",
                    FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content 2"))
                }
            };
            var service = new Mock<FileService>(configMock.Object) { CallBase = true };
            service.SetupSequence(s => s.UploadImageAsync(It.IsAny<FileUploadModel>()))
               .ThrowsAsync(new Exception("Upload failed"))
               .ReturnsAsync(() => "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg");
            var result = await service.Object.UploadImagesAsync(files);
            Assert.Equal(2, result.Count);
            Assert.Null(result[0].Url);
            Assert.Equal("Upload failed", result[0].ErrorMessage);
            Assert.Equal("https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", result[1].Url);

        }

        [Fact]
        public async Task UploadModel3DAsync_WithFileIsNull_ThrowsException() {
            var fileService = CreateFileService();
            var result = await
                Assert.ThrowsAsync<ArgumentNullException>(async () => await fileService.UploadModel3DAsync(null));
            Assert.NotNull(result);

        }
        [Fact]
        public async Task UploadModel3DAsync_WithFileNameIsNull_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = new FileUploadModel
            {
                ContentType = "",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content")),
                FolderName = "abc"
            };
            var result = await
               Assert.ThrowsAsync<Exception>(async () => await fileService.UploadModel3DAsync(file));
            Assert.NotNull(result);
            Assert.Equal("Missing FileName.", result.Message);
        }
        [Fact]
        public async Task UploadModel3DAsync_WithFileNameIsEmpty_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = new FileUploadModel
            {
                ContentType = "",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content")),
                FolderName = "abc",
                FileName = ""
            };
            var result = await
               Assert.ThrowsAsync<Exception>(async () => await fileService.UploadModel3DAsync(file));
            Assert.NotNull(result);
            Assert.Equal("Missing FileName.", result.Message);
        }
        [Fact]
        public async Task UploadModel3DAsync_WithFileStreamIsNull_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = new FileUploadModel
            {
                ContentType = "",
                FileStream = null,
                FolderName = "abc",
                FileName = "abc"
            };
            var result = await
               Assert.ThrowsAsync<Exception>(async () => await fileService.UploadModel3DAsync(file));
            Assert.NotNull(result);
            Assert.Equal("Invalid FileStream.", result.Message);
        }
        [Fact]
        public async Task UploadModel3DAsync_WithFileNameDontHaveExtension_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = new FileUploadModel
            {
                ContentType = "",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content")),
                FolderName = "abc",
                FileName = "abc"
            };
            var result = await
               Assert.ThrowsAsync<Exception>(async () => await fileService.UploadModel3DAsync(file));
            Assert.NotNull(result);
            Assert.Equal("File type is not allowed", result.Message);
        }

        [Fact]
        public async Task UploadModel3DAsync_WithFileNameHaveInvalidExtension_ThrowsException() {
            var fileService = CreateFileService();
            FileUploadModel file = new FileUploadModel
            {
                ContentType = "",
                FileStream = new MemoryStream(Encoding.UTF8.GetBytes("dummy image content")),
                FolderName = "abc",
                FileName = "abc.txt"
            };
            var result = await
               Assert.ThrowsAsync<Exception>(async () => await fileService.UploadModel3DAsync(file));
            Assert.NotNull(result);
            Assert.Equal("File type is not allowed", result.Message);
        }

        [Fact]
        public async Task UploadModel3DAsync_WithVaild_AddSuccessfully() {
            var configMock = new Mock<IConfiguration>();
            configMock.SetupGet(x => x["Cloudinary:CloudName"]).Returns("abc");
            configMock.SetupGet(x => x["Cloudinary:ApiKey"]).Returns("123");
            configMock.SetupGet(x => x["Cloudinary:ApiSecret"]).Returns("456");
            configMock.SetupGet(x => x["R2:AccountId"]).Returns("acc");
            configMock.SetupGet(x => x["R2:AccessKeyId"]).Returns("ak");
            configMock.SetupGet(x => x["R2:SecretAccessKey"]).Returns("sk");
            configMock.SetupGet(x => x["R2:Bucket"]).Returns("bucket-3d");
            configMock.SetupGet(x => x["R2:PublicBaseUrl"]).Returns("https://cdn.com");
            var serviceMock = new Mock<FileService>(configMock.Object) { CallBase = true };

            serviceMock
          .Protected()
          .Setup<Task>("PutToS3Async", ItExpr.IsAny<PutObjectRequest>())
          .Returns(Task.CompletedTask);

            var stream = new MemoryStream(new byte[] { 1, 2, 3 });
            var uploadModel = new FileUploadModel
            {
                FileName = "car.glb",
                FileStream = stream,
                FolderName = "models",
                ContentType = "model/gltf-binary"
            };
            var resultUrl = await serviceMock.Object.UploadModel3DAsync(uploadModel);
            Assert.StartsWith("https://cdn.com/models/", resultUrl);
            Assert.EndsWith(".glb", resultUrl);
        }
        public class NonSeekableStream : MemoryStream {
            public override bool CanSeek => false;
            public NonSeekableStream(byte[] buffer) : base(buffer) { }
        }
        [Fact]
        public async Task UploadModel3DAsync_WhenStreamIsNonSeekable_CopiesToMemoryStream() {
            var configMock = new Mock<IConfiguration>();
            configMock.SetupGet(x => x["Cloudinary:CloudName"]).Returns("abc");
            configMock.SetupGet(x => x["Cloudinary:ApiKey"]).Returns("123");
            configMock.SetupGet(x => x["Cloudinary:ApiSecret"]).Returns("456");
            configMock.SetupGet(x => x["R2:AccountId"]).Returns("acc");
            configMock.SetupGet(x => x["R2:AccessKeyId"]).Returns("ak");
            configMock.SetupGet(x => x["R2:SecretAccessKey"]).Returns("sk");
            configMock.SetupGet(x => x["R2:Bucket"]).Returns("bucket-3d");
            configMock.SetupGet(x => x["R2:PublicBaseUrl"]).Returns("https://cdn.com");
            var serviceMock = new Mock<FileService>(configMock.Object) { CallBase = true };

            serviceMock
          .Protected()
          .Setup<Task>("PutToS3Async", ItExpr.IsAny<PutObjectRequest>())
          .Returns(Task.CompletedTask);
            var buffer = new byte[] { 10, 20, 30, 40 };
            var nonSeekStream = new NonSeekableStream(buffer);
            var uploadModel = new FileUploadModel
            {
                FileName = "car.glb",
                FileStream = nonSeekStream,
                FolderName = "models",
                ContentType = "model/gltf-binary"
            };
            var resultUrl = await serviceMock.Object.UploadModel3DAsync(uploadModel);
            Assert.StartsWith("https://cdn.com/models/", resultUrl);
            Assert.EndsWith(".glb", resultUrl);

        }



    }
}
