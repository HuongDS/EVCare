using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class InvoiceRepository : GenericRepository<Invoices>, IInvoiceRepository
    {
        public InvoiceRepository(EVCareDbContext dbContext, DbSet<Invoices> dbSet) : base(dbContext, dbSet)
        {
        }
    }
}
