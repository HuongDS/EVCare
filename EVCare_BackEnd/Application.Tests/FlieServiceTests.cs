using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Application.Service;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DataAccess.Dtos.File;
using Microsoft.Extensions.Configuration;
using Moq;

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

            var fileService = _fixture.Create<FileService>();
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
    }
}
