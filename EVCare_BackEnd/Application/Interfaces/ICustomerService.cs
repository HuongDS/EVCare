using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Pagination;

namespace Application.Interfaces
{
    public interface ICustomerService
    {
        Task<PageResultDto<CustomerViewModel>> GetAllCustomers(CustomerQueryDto model);
        Task<CustomerViewDto> GetCustomerByAccountId(int accountId);
    }
}
