using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRedisService
    {
        Task DeleteAsync(string v);
        Task<T?> GetObjectData<T>(string email) where T : class;
        Task SaveDate(DataAccess.Entities.Invoice invoice,string orderCode);
    }
}
