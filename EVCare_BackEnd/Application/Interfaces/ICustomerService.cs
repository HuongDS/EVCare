using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Customers;

namespace Application.Interfaces
{
    public interface ICustomerService
    {
      
        Task<CustomerViewDto> GetCustomerByAccountId(int accountId);
    }
}
