using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IPartRepository : IGenericRepository<Part>, IGenericCategoryRepository<Part>
    {
        Task UpdateStockPartAsync(int partID, int quantity);
    }
}
