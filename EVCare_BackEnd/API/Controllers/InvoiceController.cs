using Application.Interfaces;
using DataAccess.Dtos.Invoice;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        public InvoiceController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpPost("create-payment-url")]
        public IActionResult CreatePaymentUrl(InvoiceCreateModel model)
        {
            try
            {
                var paymentUrl =  _invoiceService.CreatePaymentUrl(HttpContext, model);
                return Ok(new
                {
                    statusCode = 200,
                    message = "Payment URL created successfully",
                    data = paymentUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

        [HttpGet("payment-callback")]
        public IActionResult PaymentCallback()
        {

            try
            {
                _invoiceService.PaymentCallback(Request.Query);
                return Ok(new
                {
                    statusCode = 200,
                    message = "Payment processed successfully"
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = ex.Message
                });

            }
        }
    }
}
