using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        public AccountController(IAccountService accountService)
        {

            _accountService = accountService;
        }
        [HttpGet("me")]
        [Authorize]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> GetMyAccountDetail()
        {
            try
            {
                var accountId = (int)HttpContext.Items["AccountId"];
                var account = await _accountService.GetAccountById(accountId);
                return Ok(new ResponseDto<AccountViewModel>
                {
                    data = account,
                    statusCode = HttpStatus.OK,
                    message = Message.GET_ACCOUNT_SUCCESS
                });

            }
            catch (Exception ex)
            {

                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message

                });

            }
        }
        [HttpPut("update-me")]
        [Authorize]
        [ServiceFilter(typeof(SetAccountIdFilter))]
        public async Task<IActionResult> UpdateAccountDetail(AccountUpdateDto data)
        {
            var accountId = (int)HttpContext.Items["AccountId"];
            try
            {
                var response = await _accountService.UpdateAccountByAccountID(data, accountId);
                return Ok(new ResponseDto<AccountViewModel>
                {
                    data = response,
                    statusCode = HttpStatus.OK,
                    message = Message.UPDATE_ACCOUNT_SUCCESS
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }

        [HttpDelete("{accountId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(int accountId)
        {
            try
            {
                await _accountService.DeleteAccount(accountId);
                
                return Ok(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.OK,
                    message = Message.DELETE_ACCOUNT_SUCCESS
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    data = null,
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message
                });
            }
        }
    }
}
