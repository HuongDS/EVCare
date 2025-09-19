using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Helper;
using Application.Interfaces;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.VnPay;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string CreatePaymentUrl(HttpContext context, InvoiceCreateModel model)
        {
            var tick = DateTime.Now.Ticks.ToString();
            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"]);
            vnpay.AddRequestData("vnp_Command", _configuration["VnPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", (model.Total_Price * 100).ToString()); //Số tiền thanh toán. Số tiền không 
            //mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND
            //(một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần(khử phần thập phân), sau đó gửi sang VNPAY
           // là: 10000000
             
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _configuration["VnPay:CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"]);
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + model.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other"); 
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:PaymentBackReturnUrl"]);
            vnpay.AddRequestData("vnp_TxnRef",model.OrderId.ToString());
            var returnUrl = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"], _configuration["VnPay:HashSecret"]);
            return returnUrl;

        }

        public VnPaymentResponseModel PaymentExecute(IQueryCollection collection)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key,value) in collection)
            {
               if(!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }
            var vnp_OrderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_TrasactionNo = Convert.ToDecimal(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collection.FirstOrDefault(p=>p.Key=="vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");
            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _configuration["VnPay:HashSecret"]);
            if(!checkSignature)
            {
                return new VnPaymentResponseModel()
                {
                    Success = false,

                };
            }
            return new VnPaymentResponseModel()
            {
                Success = true,
                PaymentMethod = "VNPAY",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_OrderId.ToString(),
                TransactionId = vnp_TrasactionNo.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode
            };
        }
    }
}
