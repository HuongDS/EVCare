using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Part;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPartService
    {
        Task<int> CreateAPart(PartCreateModel model,int employeeId);
        Task DeleteAPart(int id,int accountId);
        Task DetelePart(int id, int acccountId);
        Task RestoreAPart(int id,int accountId);
        Task<byte[]> ExportPartAsync();
        Task<PageResultDto<PartViewModel>> GetAllParts(PartQueryDto model);
        Task StaffUpdateAPart(PartStaffUpdateModel model,int accountId);
        Task UpdateAPart(int id,PartAdminUpdateModel model,int accountId);
        Task RestoreAPartSave(int id, int accountId);
        Task<byte[]> GetPartImportTemplate();
        Task<PartImportResult> ImportPartAsync(IFormFile file, int accountId);
        byte[] GeneratePartImportErrorFile(List<PartImportErrorModel> errors);
        Task<decimal> GetTotalPriceOfParts();
        Task<IEnumerable<PartViewModel>> GetLowStockParts();
    }
}
