using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Application.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMapper _mapper;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly INotificationServices _notificationServices;
        private readonly IAppointmentService _appointmentService;
        private readonly IServiceCenterService _serviceCenterService;
        private readonly IOrderService _orderService;
        private readonly IPayOSService _payOSService;
        private readonly StackExchange.Redis.IDatabase _db;
        private readonly IPayOSGateWay _gw;

        public InvoiceService(IVnPayService vnPayService, IMapper mapper,
            IInvoiceRepository invoiceRepository
            ,IOrderRepository orderRepository,
            INotificationServices notificationServices,
            IAppointmentService appointmentService,
            IServiceCenterService serviceCenterService,
            IOrderService orderService
            ,IPayOSService payOSService,
            IConnectionMultiplexer redis,
            IPayOSGateWay gw
            )
        {
            _vnPayService = vnPayService;
            _mapper = mapper;
            _invoiceRepository = invoiceRepository;
            _orderRepository = orderRepository;
            _notificationServices = notificationServices;
            _appointmentService = appointmentService;
            _serviceCenterService = serviceCenterService;
            _orderService = orderService;
            _payOSService = payOSService;
            _gw = gw;
            _db = redis.GetDatabase();
        }

        public async Task<int> CreateInvoice(InvoiceCreateModel model)
        {
            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Completed;
            await _invoiceRepository.AddAsync(invoice);
            return invoice.Id;
        }

        public async Task<string> CreatePaymentUrl(HttpContext context, InvoiceCreateModel model)
        {
            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Pending;
            await _invoiceRepository.AddAsync(invoice);
            return _vnPayService.CreatePaymentUrl(context, model);
        }

        public async Task SendMailToPayAsync(string paymentUrl, InvoiceCreateModel model)
        {
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
        }

        public async Task PaymentCallback(IQueryCollection query)
        {
            var result = _vnPayService.PaymentExecute(query);
            var invoice = await _invoiceRepository.GetInvoiceById(int.Parse(result.OrderId));
            if (result == null || result.VnPayResponseCode != "00")
            {
                await _invoiceRepository.DeleteAsync(invoice.Id);
                throw new Exception("Payment failed or invalid response");
            }
            else
            {
                if (invoice == null)
                {
                    throw new Exception("Invoice not found");
                }
                invoice.Status = DataAccess.Enums.PaymentStatusEnum.Completed;

                await _invoiceRepository.UpdateAsync(invoice);



            }
        }
        public async Task<string> CreatePayOSUrl(InvoiceCreateModel model)
        {
           
            var (url,orderCode) =  await _payOSService.CreateCheckoutUrlAsync(model);

            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.OrderCode = orderCode;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Pending;
         //   await _invoiceRepository.AddAsync(invoice);
           await  _db.StringSetAsync(orderCode.ToString(), 
                System.Text.Json.JsonSerializer.Serialize(invoice)
                , TimeSpan.FromMinutes(10));
            return url;
        }
        public async Task HandleWebhookAsync(string raw, string? sig)
        {
            try
            {
                if (!_gw.Verify(raw, sig))
                {
                    Console.WriteLine("❌ Signature verification failed");
                    return;
                }

                dynamic p = JsonConvert.DeserializeObject(raw);
                string? oc = p?.data?.orderCode?.ToString();
                string? code = p?.data?.code?.ToString();
                string? desc = p?.data?.desc?.ToString();

                if (string.IsNullOrWhiteSpace(oc))
                {
                    Console.WriteLine("⚠️ Missing orderCode in webhook");
                    return;
                }

                var orderCode = long.Parse(oc);
                var invoiceJson = await _db.StringGetAsync(orderCode.ToString());
                if (!invoiceJson.HasValue)
                {
                    Console.WriteLine($"⚠️ Redis key {orderCode} not found or expired");
                    return;
                }

                var invoice = System.Text.Json.JsonSerializer.Deserialize<Invoice>(invoiceJson!);
                if (invoice == null)
                {
                    Console.WriteLine("⚠️ Invoice deserialize failed");
                    return;
                }

                if (code == "00" || string.Equals(desc, "success", StringComparison.OrdinalIgnoreCase))
                {
                    invoice.Customer = null;
                    invoice.Order = null;
                    invoice.Status = PaymentStatusEnum.Completed;
                    invoice.Updated_At = DateTime.Now;

                    try
                    {
                        await _invoiceRepository.AddAsync(invoice);
                        await _db.KeyDeleteAsync(orderCode.ToString());
                        Console.WriteLine($"✅ Invoice inserted: orderCode={orderCode}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ EF Insert error: {ex}");
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Payment failed: code={code}, desc={desc}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook outer error: {ex}");
                throw; 
            }
        }

        public async Task<IEnumerable<InvoiceViewModel>?> GetInvoicesByCustomerId(int customerId)
        {
            return await _invoiceRepository.GetInvoicesByCustomerId(customerId);

        }

        public async Task CancelPayOSOrder(int orderId)
        {
            var invoice = await _invoiceRepository.GetInvoiceByOrderId(orderId);
            if (invoice == null) throw new Exception("Invoice not found");
            await _invoiceRepository.DeleteAsync(invoice.Id);  
        }
    }
}
