using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Invoice;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMapper _mapper;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IOrderRepository _orderRepository;
        public InvoiceService(IVnPayService vnPayService, IMapper mapper, IInvoiceRepository invoiceRepository, IOrderRepository orderRepository)
        {
            _vnPayService = vnPayService;
            _mapper = mapper;
            _invoiceRepository = invoiceRepository;
            _orderRepository = orderRepository;
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
    }
}
