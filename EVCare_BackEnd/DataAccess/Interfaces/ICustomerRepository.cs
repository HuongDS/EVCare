using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface ICustomerRepository : IGenericRepository<Customer>
    {
        Task<PageResultDto<CustomerViewModel>> GetAllCustomers(CustomerQueryDto model);
        public Task<CustomerViewDto?> GetCustomerByAccountId(int accountId);
    }
}
