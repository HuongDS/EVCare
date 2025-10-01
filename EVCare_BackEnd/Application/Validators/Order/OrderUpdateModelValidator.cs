using DataAccess.Dtos.Orders;
using DataAccess.Dtos.Service;
using FluentValidation;

namespace Application.Validators.Order
{
    public class OrderUpdateModelValidator : AbstractValidator<OrderUpdateModel>
    {
        public OrderUpdateModelValidator() {

            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is a positive");
            RuleFor(x => x.Parts).NotNull().WithMessage("Part is not null");
        
        }
    }
}
