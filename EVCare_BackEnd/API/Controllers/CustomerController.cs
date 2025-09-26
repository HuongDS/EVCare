using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }
        [HttpGet("{accountId}")]
        [Authorize]
        [ServiceFilter(typeof(AuthorizeCustomerAndStaffThroughAccountIdFilter))]
        public async Task<IActionResult> GetCustomerByAccountId(int accountId)
        {
            try
            {
                var customer = await _customerService.GetCustomerByAccountId(accountId);
                if (customer == null)
                {
                    throw new Exception(Message.NOT_FOUND);

                }

                return Ok(new ResponseDto<CustomerViewDto>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.CUSTOMER_GET_SUCCESSFULLY,
                    data = customer
                });

            }
            catch (Exception ex)
            {
                {
                    return BadRequest(new ResponseDto<object>
                    {
                        statusCode = HttpStatus.BAD_REQUEST,
                        message = ex.Message,
                        data = null

                    });
                }

            }
        }
    }
}
