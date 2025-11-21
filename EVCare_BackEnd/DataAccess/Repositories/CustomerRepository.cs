using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PageResultDto<CustomerViewModel>> GetAllCustomers(CustomerQueryDto model)
        {
            var query = _dbContext.Customers.AsNoTracking()
                .Include(x => x.Account)
                .Select(x => new CustomerViewModel
                {
                    AccountId = x.AccountId,
                    CustomerName = x.Account.First_Name + " " + x.Account.Last_Name,
                    Banned = x.Account.Deleted_At != DateTime.MinValue,
                    Email = x.Account.Email,
                    PhoneNumber = x.Account.Phone,
                    Address = x.Address,
                    Vehicles = x.Vehicles.Where(x => x.Deleted_At == DateTime.MinValue)
                    .Select(v => new Dtos.Vehicle.VehicleViewModel
                    {
                        CategoryName = v.Category.Name,
                        LicensePlate = v.LicensePlate,
                        cateId = (v.Category.Deleted_At != DateTime.MinValue) ? 0 : v.CategoryId,
                        Id = v.Id,
                        Image = v.Image,
                    }),
                    CustomerId = x.Id,
                });


            if (!string.IsNullOrEmpty(model.Keyword))
            {
                var keyword = model.Keyword.Trim().ToLower();
                query = query.Where(x => x.CustomerName.ToLower().Contains(keyword)
                || x.Email.ToLower().Contains(keyword)
                || x.PhoneNumber.ToLower().Contains(keyword));
            }
            query = query.ApplySorting(model.SortField, model.SortOrder);
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
        }

        public Task<int> GetBannedCustomers()
        {
            return _dbContext.Customers
                 .Include(x => x.Account)
                 .Where(x => x.Account.Deleted_At != DateTime.MinValue)
                 .CountAsync();
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
