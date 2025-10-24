using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        //Task BeginTransactionAsync();
        //Task CommitAsync();
        //Task RollbackAsync();
        //Task<int> SaveChangesAsync();
        Task ExecuteInTransactionAsync(Func<Task> operation);
      
        Task SaveChangesAsync();
    }
}
