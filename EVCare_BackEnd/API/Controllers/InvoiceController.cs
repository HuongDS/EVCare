using Application.Interfaces;
using Application.Services;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
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
                        statusCode = 200,
                        message = "Payment URL created successfully",
                        data = paymentUrl
                    });

                }
                else
                {
                    var invoiceId = await _invoiceService.CreateInvoice(model);
                    return Ok(new ResponseDto<int>
                    {
                        statusCode = 200,
                        message = "Create successfully",
                        data = invoiceId

                    });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<Object>
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
    }
}
