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
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Entities;
using DataAccess.Interfaces;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Google.Apis.Auth.OAuth2;

namespace Application.Services
{
    public class PartService : IPartService
    {
        private readonly IPartRepository _partRepository;
        private readonly IPartCategoryRepository _partCategoryRepository;
        private readonly IPartHistoryRepository _partHistoryRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IMapper _mapper;
        public PartService(
            IPartRepository partRepository,IPartCategoryRepository partCategoryRepository, IMapper mapper
            , IPartHistoryRepository partHistoryRepository, IAccountRepository accountRepository) {
            _partRepository = partRepository;
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
            _partHistoryRepository = partHistoryRepository;
            _accountRepository = accountRepository;
        }

        public async Task<int> CreateAPart(PartCreateModel model,int employeeId)
        {
            var category = await _partCategoryRepository.GetByIdAsync(model.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            
            var part = _mapper.Map<DataAccess.Entities.Part>(model);
            var id = (await _partRepository.AddAsync(part)).Id;

            var partHistory = _mapper.Map<PartHistory>(model);
            partHistory.PartId = id;
            var account = await _accountRepository.GetByIdAsync(employeeId);
            partHistory.EmployeeName = account.First_Name + " " + account.Last_Name;
            await _partHistoryRepository.AddAsync(partHistory);
            return id;
        }

        public async Task DeleteAPart(int id)
        {
            var part = await _partRepository.GetByIdAsync(id);
            if (part == null)
            {
                throw new Exception("Part not found");
            }
            part.Deleted_At = DateTime.UtcNow;
            await _partRepository.UpdateAsync(part);
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




    public async Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model)
        {
            return await _partRepository.GetAllParts(model);
        }

        public async Task UpdateAPart(int id, PartStaffUpdateModel model)
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
