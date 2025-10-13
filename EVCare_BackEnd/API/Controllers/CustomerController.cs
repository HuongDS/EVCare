using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Customers;
using DataAccess.Dtos.Pagination;
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

        [HttpGet()]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> GetAllCustomers([FromQuery]CustomerQueryDto model)
        {
            try
            {
                var customers = await _customerService.GetAllCustomers(model);
                return Ok(new ResponseDto<PageResultDto<CustomerViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.CUSTOMERS_GET_SUCCESSFULLY,
                    data = customers
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
