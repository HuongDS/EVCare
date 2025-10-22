using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using ClosedXML.Excel;
using CloudinaryDotNet;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class PartService : IPartService
    {
        private readonly IPartRepository _partRepository;
        private readonly IPartCategoryRepository _partCategoryRepository;
        private readonly IPartHistoryRepository _partHistoryRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public PartService(
            IPartRepository partRepository,IPartCategoryRepository partCategoryRepository, IMapper mapper
            , IPartHistoryRepository partHistoryRepository, IAccountRepository accountRepository,IUnitOfWork unitOfWork) {
            _partRepository = partRepository;
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
            _partHistoryRepository = partHistoryRepository;
            _accountRepository = accountRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CreateAPart(PartCreateModel model,int accountId)
        {
            int id = 0;
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var category = await _partCategoryRepository.GetByIdAsync(model.CategoryId);
                if (category == null) {
                    throw new Exception("Category not found");
                }
                var part = _mapper.Map<DataAccess.Entities.Part>(model);
                await _partRepository.AddAsync(part);
                await _unitOfWork.SaveChangesAsync();
                var partHistory = _mapper.Map<PartHistory>(model);
                partHistory.Part = part;
                var account = await _accountRepository.GetByIdAsync(accountId);
                partHistory.EmployeeName = account.First_Name + " " + account.Last_Name;
                await _partHistoryRepository.AddAsync(partHistory);
                id = part.Id;
            });
            return id;
           
        }

        public async Task DeleteAPart(int id,int accountId)
        {

           await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var part = await _partRepository.GetByIdAsync(id);
                if(part == null)
                {
                    throw new Exception("Part not found");
                }
                if (part.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception("Part has been deleted");
                }
                part.Deleted_At = DateTime.Now;
                await _partRepository.UpdateAsync(part);
                var account = await _accountRepository.GetByIdAsync(accountId);
                var partHistory = new PartHistory
                {
                    PartId = part.Id,
                    OldQuantity = part.Stock,
                    NewQuantity = part.Stock,
                    OldUnitPrice = part.Price,
                    NewUnitPrice = part.Price,
                    OldReplacePrice = part.ReplacementPrice,
                    NewReplacePrice = part.ReplacementPrice,
                    ActionType = DataAccess.Enums.ActionTypeEnum.Delete,
                    ChangeDate = DateTime.Now,
                    EmployeeName = account.First_Name + " " + account.Last_Name
                };
                await _partHistoryRepository.AddAsync(partHistory);
            });
        }
        public async Task DetelePart(int id,int accountId)
        {
            var part = await _partRepository.GetByIdAsync(id);
            if (part == null) {
                throw new Exception("Part not found");
            }
            if (part.Deleted_At != DateTime.MinValue) {
                throw new Exception("Part has been deleted");
            }
            part.Deleted_At = DateTime.Now;
            await _partRepository.UpdateAsync(part);
            var account = await _accountRepository.GetByIdAsync(accountId);
            var partHistory = new PartHistory
            {
                PartId = part.Id,
                OldQuantity = part.Stock,
                NewQuantity = part.Stock,
                OldUnitPrice = part.Price,
                NewUnitPrice = part.Price,
                OldReplacePrice = part.ReplacementPrice,
                NewReplacePrice = part.ReplacementPrice,
                ActionType = DataAccess.Enums.ActionTypeEnum.Delete,
                ChangeDate = DateTime.Now,
                EmployeeName = account.First_Name + " " + account.Last_Name
            };
            await _partHistoryRepository.AddAsync(partHistory);
        }



        public async Task<byte[]> ExportPartAsync()
    {
        var parts = await _partRepository.GetAllWithCategory();

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Parts");

        // ===== Header =====
        string[] headers = { "Id", "Name", "Category", "Description", "Price", "Stock", "ReplacementPrice", "Image", "IsDeleted" };
        for (int i = 0; i < headers.Length; i++)
            ws.Cell(1, i + 1).Value = headers[i];

        var header = ws.Range("A1:I1");
        header.Style.Font.Bold = true;
        header.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        header.Style.Fill.BackgroundColor = XLColor.LightGreen;

        ws.Column(8).Width = 20; // Cột Image rộng hơn chút
        int row = 2;

        using var http = new HttpClient();

        foreach (var part in parts)
        {
            ws.Cell(row, 1).Value = part.Id;
            ws.Cell(row, 2).Value = part.Name;
            ws.Cell(row, 3).Value = part.Category?.Name;
            ws.Cell(row, 4).Value = part.Description;
            ws.Cell(row, 5).Value = part.Price;
            ws.Cell(row, 6).Value = part.Stock;
            ws.Cell(row, 7).Value = part.ReplacementPrice;
            ws.Cell(row, 9).Value = (part.Deleted_At != DateTime.MinValue);

            if (!string.IsNullOrEmpty(part.Image) && part.Image.StartsWith("http"))
            {
                try
                {
                        var imgBytes = await http.GetByteArrayAsync(part.Image);
                        using var imgStream = new MemoryStream(imgBytes);
                        var picture = ws.AddPicture(imgStream).MoveTo(ws.Cell(row, 8));
                        double originalWidth = picture.Width;
                        double originalHeight = picture.Height;
                        double maxWidth = 75.0;
                        double maxHeight = 60.0;
                        double scale = Math.Min(maxWidth / originalWidth, maxHeight / originalHeight);
                        picture.Scale(scale);
                        var cellWidth = ws.Column(8).Width * 7;   
                        var cellHeight = ws.Row(row).Height * 0.75;

                        double xOffset = Math.Max(0, (cellWidth - picture.Width) / 2);
                        double yOffset = Math.Max(0, (cellHeight - picture.Height) / 2);

                        picture.MoveTo(ws.Cell(row,8), (int)xOffset, (int)yOffset);
                        ws.Row(row).Height = 45;
                        ws.Column(8).Width = 20;
                    }
                catch
                {
                    ws.Cell(row, 8).Value = "Image load failed";
                }
            }
            else
            {
                ws.Cell(row, 8).Value = "No image";
            }

            row++;
        }


            ws.Columns("A:G").AdjustToContents();
            ws.Column("I").AdjustToContents();

            ws.Column(4).Style.Alignment.WrapText = true;
            ws.Column(3).Style.Alignment.WrapText = true;
            ws.RangeUsed().Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            ws.RangeUsed().Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        using var ms = new MemoryStream();
        workbook.SaveAs(ms);
        return ms.ToArray();
    }

        public byte[] GeneratePartImportErrorFile(List<PartImportErrorModel> errors) {
            throw new NotImplementedException();
        }

        public async Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model)
        {
            return await _partRepository.GetAllParts(model);
        }

        public async Task<byte[]> GetPartImportTemplate() {
            using var wb = new XLWorkbook();
            var ws = wb.AddWorksheet("Parts");
            string[] headers = {
                "Name","CategoryName","Description","Price",
                "ReplacementPrice","Stock"
                };
            for(int i=0;i<headers.Length;i++)
            {
                ws.Cell(1, i + 1).Value = headers[i];
            }
            ws.Cell(2, 1).Value = "Front Brake Pad A12";
            ws.Cell(2, 2).Value = "Brake System";
            ws.Cell(2, 3).Value = "High-performance ceramic pad";
            ws.Cell(2, 4).Value = 650000;
            ws.Cell(2, 5).Value = 120000;
            ws.Cell(2, 6).Value = 25;
          

            ws.Range("A1:H1").Style.Font.Bold = true;
            ws.Columns().AdjustToContents();

            var readme = wb.AddWorksheet("README");
            int rr = 1;
            readme.Cell(rr++, 1).Value = "HƯỚNG DẪN NHẬP PARTS (EVCare)";
            readme.Cell(rr++, 1).Value = "• Name: bắt buộc, phải UNIQUE trong file và không trùng với dữ liệu đã có (nếu import ở chế độ insertOnly).";
            readme.Cell(rr++, 1).Value = "• CategoryName: phải chọn từ danh sách có sẵn và chưa bị xóa. Hệ thống KHÔNG tự tạo category mới từ file import.";
            readme.Cell(rr++, 1).Value = "• Description: mô tả tự do (tùy chọn).";
            readme.Cell(rr++, 1).Value = "• Price, ReplacementPrice: số thập phân không âm.";
            readme.Cell(rr++, 1).Value = "• Stock: số nguyên không âm.";
            readme.Cell(rr++, 1).Value = "• Dòng ví dụ có sẵn ở sheet Parts (hàng 2). Hãy xóa dòng ví dụ khi import thật.";

            readme.Column(1).AdjustToContents();

            var category = wb.AddWorksheet("Categories");
            category.Cell(1, 1).Value = "Categories in System";
            var categories =  await _partCategoryRepository.GetAllAsync();
            int r = 2;
            category.Cell(r, 1).Value = "Name";
            category.Cell(r, 1).Style.Font.Bold = true;
            category.Cell(r,2).Value = "IsDelete";
            category.Cell(r, 2).Style.Font.Bold = true;
            foreach (var c in categories)
            {
                category.Cell(++r, 1).Value = c.Name;
                category.Cell(r, 2).Value = (c.Deleted_At != DateTime.MinValue);
            }
            category.Range("A1:A1").Style.Font.Bold = true;
            category.Columns().AdjustToContents();
            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            var bytes = ms.ToArray();
            return bytes;
        }

        public Task<PartImportResult> ImportPartAsync(IFormFile file, int accountId) {
            throw new NotImplementedException();
        }

        public async Task RestoreAPart(int id, int accountId) {
            var part = await _partRepository.GetByIdAsync(id);
            if(part == null)
            {
                throw new Exception("Part not found");
            }
            part.Deleted_At = DateTime.MinValue;
            await _partRepository.UpdateAsync(part);
            var account = await _accountRepository.GetByIdAsync(accountId);
            var partHistory = new PartHistory
            {
                PartId = part.Id,
                OldQuantity = part.Stock,
                NewQuantity = part.Stock,
                OldUnitPrice = part.Price,
                NewUnitPrice = part.Price,
                OldReplacePrice = part.ReplacementPrice,
                NewReplacePrice = part.ReplacementPrice,
                ActionType = DataAccess.Enums.ActionTypeEnum.Restore,
                ChangeDate = DateTime.Now,
                EmployeeName = account.First_Name + " " + account.Last_Name
            };
            await _partHistoryRepository.AddAsync(partHistory);
        }

        public async Task RestoreAPartSave(int id, int accountId) {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                await RestoreAPart(id, accountId);
            });
        }

        public async Task StaffUpdateAPart(PartStaffUpdateModel model,int accountId) {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var part = await _partRepository.GetByIdAsync(model.Id);
                if(part == null)
                {
                    throw new Exception("Part not found");
                }
                if (part.Deleted_At != DateTime.MinValue)
                {
                    throw new Exception("Part has been deleted");
                }
                var account = await _accountRepository.GetByIdAsync(accountId);
                var partHistory = new PartHistory
                {
                   PartId = part.Id,
                   OldQuantity = part.Stock,
                   NewQuantity = model.Stock,
                   OldUnitPrice = part.Price,
                   NewUnitPrice = model.UnitPrice,
                   OldReplacePrice = part.ReplacementPrice,
                   NewReplacePrice = part.ReplacementPrice,
                   ActionType = DataAccess.Enums.ActionTypeEnum.Delete,
                   ChangeDate = DateTime.Now,
                   EmployeeName = account.First_Name + " " + account.Last_Name

                };
                _mapper.Map(model, part);
                await _partRepository.UpdateAsync(part);
                await _partHistoryRepository.AddAsync(partHistory);
            });
        }

        public async Task UpdateAPart(int id, PartAdminUpdateModel model)
        {
            var part = await _partRepository.GetByIdAsync(id);
            if(part.Deleted_At!=DateTime.MinValue)
            {
                throw new Exception("Part has been deleted");
            }
            _mapper.Map(model, part);
            await _partRepository.UpdateAsync(part);
        }

      
    }
}
