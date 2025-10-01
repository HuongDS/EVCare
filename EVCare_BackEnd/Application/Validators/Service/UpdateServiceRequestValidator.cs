using DataAccess.Dtos.Service;
using FluentValidation;

namespace Application.Validators.Service
{
    public class UpdateServiceRequestValidator : AbstractValidator<ServicePutModel>
    {
        public UpdateServiceRequestValidator() {

            Include(new CreateServiceRequestValidator());
            RuleFor(x => x.Id).GreaterThan(0)
            .WithMessage("Id must be greater than 0.");

        }
    }
}
