using DataAccess.Dtos.Invoice;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class ValidateInvoiceTotalFilter : IAsyncActionFilter
    {
        private readonly IOrderRepository _orderRepository;
        public ValidateInvoiceTotalFilter(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var dto = context.ActionArguments.Values.OfType<InvoiceCreateModel>().FirstOrDefault();
            if (dto == null)
            {
                context.Result = new BadRequestObjectResult(new
                {
                    statusCode = 400,
                    message = "dto must not null here"
                });
                return;
            }
            var order = await _orderRepository.GetOrderDetailAsync(dto.OrderId);
            if (order == null)
            {
                context.Result = new NotFoundObjectResult(new
                {
                    statusCode = 404,
                    message = "Order not found"
                });
                return;
            }
            if(order.Price != dto.Total_Price)
            {
                context.Result = new BadRequestObjectResult(new
                {
                    statusCode = 400,
                    message = "Invoice total does not match order total"
                });
                return;
            }   
            await next();
        }
    }
}
