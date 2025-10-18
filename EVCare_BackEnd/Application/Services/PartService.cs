using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using ClosedXML.Excel;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using DataAccess.Interfaces;
using System.Drawing;
using DocumentFormat.OpenXml.Office2016.Excel;
using Google.Apis.Auth.OAuth2;

namespace Application.Services
{
    public class PartService : IPartService
    {
        private readonly IPartRepository _partRepository;
        private readonly IPartCategoryRepository _partCategoryRepository;
        private readonly IMapper _mapper;
        public PartService(IPartRepository partRepository,IPartCategoryRepository partCategoryRepository,IMapper mapper)
        {
            _partRepository = partRepository;
            _partCategoryRepository = partCategoryRepository;
            _mapper = mapper;
        }

        public async Task<int> CreateAPart(PartCreateModel model)
        {
            var category = await _partCategoryRepository.GetByIdAsync(model.CategoryId);
            if (category == null)
            {
                throw new Exception("Category not found");
            }
            var part = _mapper.Map<DataAccess.Entities.Part>(model);
            var id = (await _partRepository.AddAsync(part)).Id;
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

            int imgCol = 8;
            ws.Column(imgCol).Width = 15;  // vừa đủ cho 80px
            double rowHeight = 60;         // ~80px

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

                ws.Row(row).Height = rowHeight;

                var cell = ws.Cell(row, imgCol);
                if (!string.IsNullOrEmpty(part.Image) && part.Image.StartsWith("http"))
                {
                    try
                    {
                        var bytes = await http.GetByteArrayAsync(part.Image);
                        using var stream = new MemoryStream(bytes);

                        // Thêm ảnh
                        var pic = ws.AddPicture(stream)
                                    .MoveTo(cell)
                                    .WithSize(50, 50); // ép đúng 80x80 px

                        // Căn giữa ảnh trong ô (tùy chọn)
                        //double cellWpx = ws.Column(imgCol).Width * 7;
                        //double cellHpx = ws.Row(row).Height * 1.33;
                        //double offsetX = (cellWpx - 50) / 2;
                        //double offsetY = (cellHpx - 50) / 2;

                        //pic.MoveTo(cell, (int)Math.Max(0, offsetX), (int)Math.Max(0, offsetY));
                        pic.Placement = ClosedXML.Excel.Drawings.XLPicturePlacement.MoveAndSize;
                    }
                    catch
                    {
                        cell.Value = "Image load failed";
                    }
                }
                else
                {
                    cell.Value = "No image";
                }

                row++;
            }

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
