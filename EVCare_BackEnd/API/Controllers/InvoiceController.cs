using Application.Interfaces;
using Application.Services;
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

        [HttpPost("create-payment-url")]
        public async Task<IActionResult> CreatePaymentUrl(InvoiceCreateModel model)
        {
            try
            {
                var paymentUrl = await _invoiceService.CreatePaymentUrl(HttpContext, model);
                var centerInfo = await _serviceCenterService.GetCenterInformationAsync();
                var (listOrderParts, total) = await _orderService.GetOrderPartViewModelsAsync(model.OrderId);
                var appointmentId = await _orderService.GetAppointmentIdByOrderIdAsync(model.OrderId);
                var appointmentInfo = await _appointmentService.GetAppointmentInforToAsync(appointmentId);
                var invoiceData = new InvoiceMailDto
                {
                    centerInfo = centerInfo,
                    orderParts = listOrderParts,
                    appointmentInfo = appointmentInfo,
                    linkToPay = paymentUrl,
                    totalAmount = total
                };
                await _notificationServices.SendInvoiceToCustomer(invoiceData);
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
