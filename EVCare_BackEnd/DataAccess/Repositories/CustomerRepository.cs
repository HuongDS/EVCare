using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Customers;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<CustomerViewDto?> GetCustomerByAccountId(int accountId)
        {
            return await _dbContext.Customers
             .Where(x => x.AccountId == accountId)
            .Select(x => new CustomerViewDto
            {
                Id = x.Id,
                Address = x.Address,
                rank = x.Rank,
            }).FirstOrDefaultAsync();
        }


    }
}
