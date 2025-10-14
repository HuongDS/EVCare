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
                .Select(x => new CustomerViewModel
                {
                    AccountId = x.AccountId,
                    CustomerName = x.Account.First_Name + " " + x.Account.Last_Name,
                    Banned = x.Account.Deleted_At != DateTime.MinValue,
                    Email = x.Account.Email,
                    PhoneNumber = x.Account.Phone,
                    Address = x.Address,
                    Vehicles = x.Vehicles.Select(v => new Dtos.Vehicle.VehicleViewModel
                    {
                        CategoryName = v.Category.Name,
                        LicensePlate = v.LicensePlate,
                        cateId = v.CategoryId,
                        Id = v.Id,
                        Image = v.Image,
                    })
                });
            //if (!string.IsNullOrEmpty(model.CustomerName)) query = query.Where(x => x.CustomerName.Contains(model.CustomerName));
            //if (!string.IsNullOrEmpty(model.Email)) query = query.Where(x => x.Email.Contains(model.Email));
            //if (!string.IsNullOrEmpty(model.PhoneNumber)) query = query.Where(x => x.PhoneNumber.Contains(model.PhoneNumber));
            if (!string.IsNullOrEmpty(model.CustomerName)
                && !string.IsNullOrEmpty(model.Email)
                && !string.IsNullOrEmpty(model.PhoneNumber))
                query = query.Where(x => x.CustomerName.Contains(model.CustomerName)
                                    || x.Email.Contains(model.Email)
                                    || x.PhoneNumber.Contains(model.PhoneNumber));
            query = query.ApplySorting(model.SortField, model.SortOrder);
            return await PaginationHelper.PaginationAsync(query, model.PageSize.Value, model.PageIndex.Value);
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
