using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Pagination;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<PageResultDto<CustomerViewModel>> GetAllCustomers(CustomerQueryDto model)
        {
            return await _customerRepository.GetAllCustomers(model);
        }

        public async Task<int> GetBannedCustomers() {
            return await _customerRepository.GetBannedCustomers();
        }

        public async Task<CustomerViewDto> GetCustomerByAccountId(int accountId)
        {
            try
            {
                var data = await _customerRepository.GetCustomerByAccountId(accountId);
                if (data == null) throw new Exception(Message.NOT_FOUND);
                return data;
            }
            catch(Exception ex) 
            {
                throw new Exception(Message.NOT_FOUND);
            }
            
        }

      
    }
}
