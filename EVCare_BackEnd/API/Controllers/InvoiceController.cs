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
using DataAccess.Dtos.Pagination;

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
        [ServiceFilter(typeof(SetEmployeeIdFilter))]
        [ServiceFilter(typeof(AuthorizeEmployeeIsAbsent))]
        [ServiceFilter(typeof(ValidateInvoiceTotalFilter))]
        
        public async Task<IActionResult> CreateInvoice(InvoiceCreateModel model)
        {
            try
            {
                if (model.Payment_Method == DataAccess.Enums.PaymentMethodEnum.Vnpay)
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
                else if (model.Payment_Method == DataAccess.Enums.PaymentMethodEnum.Cash)
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
                return Redirect("https://ev-care.netlify.app/CompleteVNPay");
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

        //[HttpDelete("order/{orderId}")]
        //[Authorize(Roles = "Staff")]
        //public async Task<IActionResult> CancelPayOSOrder(int orderId)

        [HttpGet("get-recently-invoices")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetRecentInVoices([FromQuery] InvoiceQueryDto model)
        {
            try
            {
                //await _invoiceService.CancelPayOSOrder(orderId);
                //return Ok(new ResponseDto<string>
                var invoices = await _invoiceService.GetRecentInVoices(model);
                return Ok(new ResponseDto<PageResultDto<InvoiceViewModel>>
                {
                    statusCode = HttpStatus.OK,
                    message = Message.INVOICE_GET_SUCCESS,
                    data = invoices
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
        [HttpGet("get-revenue/{year}/{month}")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetRevenue(int year, int month)
        {
            try
            {
                var revenue = await _invoiceService.GetRevenue(year, month);
                return Ok(new ResponseDto<decimal>
                {
                    statusCode = 200,
                    message = Message.GET_REVENUE_SUCCESS,
                    data = revenue
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
        [HttpGet("by-order/{orderId}")]
        [Authorize(Roles = "Staff, Admin")]
        public async Task<IActionResult> GetInvoiceByOrderId(int orderId)
        {
            try
            {
                var invoice = await _invoiceService.GetInvoiceByOrderId(orderId);
                return Ok(new ResponseDto<InvoiceViewModel>
                {
                    statusCode = 200,
                    message = Message.INVOICE_GET_SUCCESS,
                    data = invoice
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


        [HttpGet("{orderId}/print")]
        [Authorize(Roles = "Staff")]
        public async Task<IActionResult> PrintInvoiceByOrderId(int orderId)
        {
            try
            {
                var pdfBytes = await _invoiceService.PrintInvoice(orderId);

                return File(pdfBytes, "application/pdf", $"Order_{orderId}.pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpGet("details/{orderId}")]
        [Authorize(Roles ="Staff")]
        public async Task<IActionResult> GetInvoiceDetail(int orderId) {
            try {
                var data = await _invoiceService.GetInvoiceDetailByOrderIdAsync(orderId);
                return Ok(new ResponseDto<InvoiceDetailViewModel>
                {
                    data = data,
                    statusCode = HttpStatus.OK,
                    message = Message.GET_INVOICE_DETAIL_SUCCESSFULLY

                });


            }catch(Exception ex) {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    data = null,
                    message = ex.Message

                });
            }
        }


    }
}