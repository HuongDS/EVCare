using Application.Validators.Part;
using DataAccess.Dtos.Orders;
using DataAccess.Dtos.Service;
using DataAccess.Enums;
using DataAccess.Interfaces;
using FluentValidation;

namespace Application.Validators.Order
{
    public class OrderUpdateModelValidator : AbstractValidator<OrderUpdateModel>
    {
        private readonly IOrderRepository _orderRepository;
        public OrderUpdateModelValidator(IOrderRepository orderRepository) {

            _orderRepository = orderRepository;
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is a positive");
            //RuleFor(x => x.Id)
            //    .MustAsync(async (id,cancelToken) =>
            //    {
            //         var order = await _orderRepository.GetByIdAsync(id);
            //        if (order == null) return false;
            //        return !(order.Status == OrderStatusEnum.Completed || order.Status == OrderStatusEnum.Canceled);
            //    }).WithMessage("Cannot update an order that is Done or Cancelled");

            RuleForEach(x => x.OrderParts).SetValidator(new OrderPartUpdateModelValidator());
            RuleFor(x => x.OrderParts).NotNull().WithMessage("Part is not null");
            
        }
    }
}
