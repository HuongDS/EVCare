using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using Application.DomainEvents;
using Application.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Core;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.Pagination;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
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
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly OnInvoiceCompleteHandler _onInvoiceCompleteHandler;
        private readonly IServiceCenterService _serviceCenterService;
        private readonly IOrderService _orderService;
        private readonly IPayOSService _payOSService;
        private readonly IRedisService _redisService;
        private readonly IPayOSGateWay _gw;
        private readonly IServiceCenterRepository _serviceCenterRepository;

        public InvoiceService(IVnPayService vnPayService, IMapper mapper,
            IInvoiceRepository invoiceRepository
            , IOrderRepository orderRepository,
            INotificationServices notificationServices,
            IAppointmentService appointmentService,
            IServiceCenterService serviceCenterService,
            IOrderService orderService
            , IPayOSService payOSService,
            IRedisService redisService,
            IPayOSGateWay gw,
            IAppointmentRepository appointmentRepository,
            OnInvoiceCompleteHandler onInvoiceCompleteHandler
            , IServiceCenterRepository serviceCenterRepository

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
            _redisService = redisService;
            _appointmentRepository = appointmentRepository;
            _onInvoiceCompleteHandler = onInvoiceCompleteHandler;
            _serviceCenterRepository = serviceCenterRepository;
        }

        public async Task<int> CreateInvoice(InvoiceCreateModel model)
        {
            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Completed;
            var order = await _orderRepository.GetByIdAsync(invoice.OrderId);
            order.Status = OrderStatusEnum.Completed;
            await _orderRepository.UpdateAsync(order);
            var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(invoice.OrderId);
            appointment.Status = AppointmentStatusEnum.Done;
            await _appointmentRepository.UpdateAsync(appointment);
            await _invoiceRepository.AddAsync(invoice);
            // send noti to admin dashboard
            await _onInvoiceCompleteHandler.HandleAsync();
            return invoice.Id;
        }

        public async Task<string> CreatePaymentUrl(HttpContext context, InvoiceCreateModel model)
        {
            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Pending;
            var random = new Random();
            long orderCode = ((long)random.Next(0, int.MaxValue) << 32) | (uint)random.Next(0, int.MaxValue);
            invoice.OrderCode = orderCode;
            await _redisService.SaveDate(invoice, orderCode.ToString());
            return _vnPayService.CreatePaymentUrl(context, model,invoice.OrderCode);
        }

        public async Task SendMailToPayAsync(string paymentUrl, InvoiceCreateModel model)
        {
            var centerInfo = await _serviceCenterService.GetCenterInformationAsync();
            var listOrderParts = await _orderService.GetOrderPartViewModelsAsync(model.OrderId);
            var appointmentId = await _orderService.GetAppointmentIdByOrderIdAsync(model.OrderId);
            var appointmentInfo = await _appointmentService.GetAppointmentInforToAsync(appointmentId);
            var invoiceData = new InvoiceMailDto
            {
                centerInfo = centerInfo,
                orderParts = listOrderParts,
                appointmentInfo = appointmentInfo,
                linkToPay = paymentUrl,
                totalAmount = model.Total_Price
            };
            await _notificationServices.SendInvoiceToCustomer(invoiceData);
        }

        public async Task PaymentCallback(IQueryCollection query)
        {
            var result = _vnPayService.PaymentExecute(query);
          
            if (result == null || result.VnPayResponseCode != "00")
            {
                throw new Exception("Payment failed or invalid response");
            }
            else
            {
                var invoice = await _redisService.GetObjectData<Invoice>(result.OrderCode.ToString());
                if (invoice == null)
                {
                    throw new Exception("Invoice not found");
                }
                invoice.Status = DataAccess.Enums.PaymentStatusEnum.Completed;
                await _redisService.DeleteAsync(result.OrderCode.ToString());
                await _invoiceRepository.AddAsync(invoice);
                var order = await _orderRepository.GetByIdAsync(invoice.OrderId);
                order.Status = OrderStatusEnum.Completed;
                await _orderRepository.UpdateAsync(order);
                var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(invoice.OrderId);
                appointment.Status = AppointmentStatusEnum.Done;
                await _appointmentRepository.UpdateAsync(appointment);
                // send noti to admin dashboard
                await _onInvoiceCompleteHandler.HandleAsync();


            }
        }
        public async Task<string> CreatePayOSUrl(InvoiceCreateModel model)
        {

            var invoices = await _invoiceRepository.GetInvoiceByOrderId(model.OrderId);
            if (invoices != null) throw new Exception("Order has existed");
            var (url, orderCode) = await _payOSService.CreateCheckoutUrlAsync(model);
            var customerId = await _orderRepository.GetCustomerIdByOrderId(model.OrderId);
            var invoice = _mapper.Map<Invoice>(model);
            invoice.CustomerId = customerId;
            invoice.OrderCode = orderCode;
            invoice.Status = DataAccess.Enums.PaymentStatusEnum.Pending;
            await _redisService.SaveDate(invoice, orderCode.ToString());
            return url;
        }
        public async Task HandleWebhookAsync(string raw, string? sig)
        {
            try
            {
                if (!_gw.Verify(raw, sig))
                {
                    return;
                }
                dynamic p = JsonConvert.DeserializeObject(raw);
                string? oc = p?.data?.orderCode?.ToString();
                string? code = p?.data?.code?.ToString();
                string? desc = p?.data?.desc?.ToString();

                if (string.IsNullOrWhiteSpace(oc))
                {
                    return;
                }

                var orderCode = long.Parse(oc);
                var invoice = await _redisService.GetObjectData<Invoice>(orderCode.ToString());

                if (invoice == null)
                {
                    return;
                }

                if (code == "00" || string.Equals(desc, "success", StringComparison.OrdinalIgnoreCase))
                {
                    invoice.Id = 0;
                    invoice.Customer = null;
                    invoice.Order = null;
                    invoice.Status = PaymentStatusEnum.Completed;
                    invoice.Updated_At = DateTime.UtcNow.AddHours(7);
                    invoice.OrderCode = orderCode;
                    var order = await _orderRepository.GetByIdAsync(invoice.OrderId);
                    order.Status = OrderStatusEnum.Completed;
                    await _orderRepository.UpdateAsync(order);
                    var appointment = await _appointmentRepository.GetAppointmentByOrderIdAsync(invoice.OrderId);
                    appointment.Status = AppointmentStatusEnum.Done;
                    await _appointmentRepository.UpdateAsync(appointment);
                    try
                    {
                        await _redisService.DeleteAsync(orderCode.ToString());
                        await _invoiceRepository.AddAsync(invoice);
                        // send noti to admin dashboard
                        await _onInvoiceCompleteHandler.HandleAsync();
                    }
                    catch (Exception ex)
                    {
                    }
                }
                else
                {
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<IEnumerable<InvoiceViewModel>?> GetInvoicesByCustomerId(int customerId)
        {
            return await _invoiceRepository.GetInvoicesByCustomerId(customerId);

        }
        public async Task<decimal> GetRevenue(int year, int month)
        {
            return await _invoiceRepository.GetRevenue(year, month);
        }
        public async Task<PageResultDto<InvoiceViewModel>> GetRecentInVoices(InvoiceQueryDto model)
        {
            return await _invoiceRepository.GetRecentInVoices(model);
        }

        public async Task CancelPayOSOrder(int orderId)
        {
            var invoice = await _invoiceRepository.GetInvoiceByOrderId(orderId);
            if (invoice == null) throw new Exception("Invoice not found");
            await _invoiceRepository.DeleteAsync(invoice.Id);
        }

        public async Task<InvoiceViewModel> GetInvoiceByOrderId(int orderId)
        {
            return await _invoiceRepository.GetInvoiceViewModelByOrderId(orderId);
        }

        public async Task<byte[]> PrintInvoice(int orderId)
        {
           var order = await _orderRepository.GetByIdAsync(orderId);
            if(order == null) throw new Exception("Order not found");   
            var invoice = await _invoiceRepository.GetInvoiceByOrderId(orderId);
            if (invoice == null) throw new Exception("Invoice not found");

            var invoiceData = await _invoiceRepository.GetInvoicePrintData(orderId);
            var serviceCenter = await _serviceCenterRepository.GetCenterInforAsync();

            var pdf = QuestPDF.Fluent.Document.Create(container => {

                container.Page(page =>
                {
                    page.Margin(40);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header().Column(col =>
                    {
                        col.Spacing(5);


                        col.Item().Text(serviceCenter.Name)
                            .Bold().FontSize(18).FontColor(Colors.Blue.Medium);
                        col.Item().Text($"Phone: {serviceCenter.Hotline}");
                        col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten1);
                    });
                    page.Content().Column(col =>
                    {
                        col.Spacing(15);

                        col.Item().Text($"Invoice ID: {invoice.Id}");
                        col.Item().Text($"Customer: {invoiceData.CustomerName}");
                        col.Item().Text($"Vehicle: {invoiceData.VehicleLicensePlate}");
                        col.Item().Text($"Appointment Date: {invoiceData.AppointmentDate:dd/MM/yyyy}");
                        col.Item().Text($"Payment Date: {invoiceData.PaymentDate:dd/MM/yyyy}");
                        col.Item().Text($"Payment Method: {invoiceData.PaymentMethod}");
                        col.Item().LineHorizontal(1);
                        col.Item().Text("Service Items").Bold().FontSize(14);
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.RelativeColumn(3);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Service Name").Bold();
                            });

                            foreach (var s in invoiceData.ServiceItems)
                            {
                                table.Cell().Text(s.Name);

                            }
                        });


                        col.Item().Text("Part Items").Bold().FontSize(14);
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.RelativeColumn(3);
                                cols.RelativeColumn(1);
                                cols.RelativeColumn(1);
                                cols.RelativeColumn(2);
                                cols.RelativeColumn(2);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Part Name").Bold();
                                header.Cell().Text("Quantity").Bold();
                                header.Cell().Text("Price").Bold();
                                header.Cell().Text("Replacement Price").Bold();
                                header.Cell().Text("Total Price").Bold();
                            });

                            foreach (var p in invoiceData.PartItems)
                            {
                                table.Cell().Text(p.PartName);
                                table.Cell().Text(p.Quantity.ToString());
                                table.Cell().Text($"{p.UnitPrice}");
                                table.Cell().Text($"{p.ReplacePrice}");
                                table.Cell().Text($"{(p.ReplacePrice+p.UnitPrice)*p.Quantity}");
                            }
                            table.Cell().Text("");
                            table.Cell().Text("");
                            table.Cell().Text("");
                            table.Cell().Text("");
                            table.Cell().Element(e => e
                                .BorderTop(1)
                                .BorderColor(Colors.Grey.Lighten2)
                                .PaddingTop(4)
                                .Text($"Tax: {serviceCenter.Vat:0.##}%")
                                .Bold());
                        });
                        col.Item().LineHorizontal(1);
                        col.Item().AlignRight()
                           .Text($"Total: {invoiceData.TotalPrice}")
                           .Bold().FontSize(14);
                    });
                    page.Footer().AlignCenter().Text("Thank you for trusting our service!");
                });
            
            });

            using var stream = new MemoryStream();
            pdf.GeneratePdf(stream);
            return stream.ToArray();

        }
    }
}
