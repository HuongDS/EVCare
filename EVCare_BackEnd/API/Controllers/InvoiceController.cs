using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using Application.Services;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Filters;
using Application.Infrastructures;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly INotificationServices _notificationServices;
        private readonly IAppointmentService _appointmentService;
        private readonly IServiceCenterService _serviceCenterService;
        private readonly IOrderService _orderService;

        public InvoiceController(IInvoiceService invoiceService, INotificationServices notificationServices,
            IAppointmentService appointmentService, IServiceCenterService serviceCenterService,
            IOrderService orderService)
        {
            _invoiceService = invoiceService;
            _notificationServices = notificationServices;
            _appointmentService = appointmentService;
            _serviceCenterService = serviceCenterService;
            _orderService = orderService;
        }
        [Authorize(Roles = "Staff")]
        [HttpPost]
        //update to merger
        public async Task<IActionResult> CreateInvoice(InvoiceCreateModel model)
        {
            try
            {
                if (model.Payment_Method == DataAccess.Enums.PaymentMethodEnum.CreditCard)
                {
                    var paymentUrl = await _invoiceService.CreatePaymentUrl(HttpContext, model);
                    await _invoiceService.SendMailToPayAsync(paymentUrl, model);
                    return Ok(new ResponseDto<string>
                    {
                        statusCode = HttpStatus.CREATED,
                        message = "Payment URL created successfully",
                        data = paymentUrl
                    });

                }
                else if(model.Payment_Method== DataAccess.Enums.PaymentMethodEnum.Cash)
                {
                    var invoiceId = await _invoiceService.CreateInvoice(model);
                    return Ok(new ResponseDto<int>
                    {
                        statusCode = HttpStatus.CREATED,
                        message = "Create successfully",
                        data = invoiceId
                    });
                }
                else
                {
                   var paymentUrl = await _invoiceService.CreatePayOSUrl(model);
                    return Ok(new ResponseDto<string>
                    {
                        statusCode = HttpStatus.CREATED,
                        message = "Payment URL created successfully",
                        data = paymentUrl
                    });
                }
              

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

        [HttpGet("payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {

            try
            {
                await _invoiceService.PaymentCallback(Request.Query);
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


        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            try
            {
                using var sr = new StreamReader(Request.Body, Encoding.UTF8);
                var raw = await sr.ReadToEndAsync();

                string? sig = Request.Headers["x-payos-signature"].FirstOrDefault()
                           ?? Request.Headers["x-signature"].FirstOrDefault()
                           ?? Request.Headers["x-checksum"].FirstOrDefault();

                await _invoiceService.HandleWebhookAsync(raw, sig);
                return Ok();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("Error");

            }
           
         }

        [HttpGet("invoices")]
        [Authorize(Roles = "Customer")]
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        public async Task<IActionResult> GetInvoicesByCustomerId()
        {
            var customerId = (int)HttpContext.Items["CustomerId"];
            try
            {
                var response = await _invoiceService.GetInvoicesByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<InvoiceViewModel>?>
                {
                    statusCode = 200,
                    message = Message.INVOICE_GET_SUCCESS,
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }
        [HttpGet("invoices/employeee/{customerId}")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetInvoicesByCustomerId(int customerId)
        {
            try
            {
                var response = await _invoiceService.GetInvoicesByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<InvoiceViewModel>?>
                {
                    statusCode = 200,
                    message = Message.INVOICE_GET_SUCCESS,
                    data = response
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }

        }

        [HttpDelete("order/{orderId}")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> CancelPayOSOrder(int orderId)
        {
            try
            {
                await _invoiceService.CancelPayOSOrder(orderId);
                return Ok(new ResponseDto<string>
                {
                    statusCode = HttpStatus.OK,
                    message = "Cancel PayOS order successfully",
                    data = "Cancel PayOS order successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }

    }
}