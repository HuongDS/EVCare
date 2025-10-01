using DataAccess.Dtos.Service;
using FluentValidation;


namespace Application.Validators.Service
{
    public class CreateServiceRequestValidator : AbstractValidator<ServicePostModel>
    {
        public CreateServiceRequestValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                .WithMessage("Name is required")
                .Must(v=>(v??string.Empty).Trim().Length>=3)
                .WithMessage("Name must be at least 3 characters.")
                .Must(v => (v ?? string.Empty).Trim().Length <= 100)
                .WithMessage("Name must be at most 100 characters.");

            RuleFor(x=>x.Description)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Description is required")
                .Must(v => (v ?? string.Empty).Trim().Length >= 3)
                .WithMessage("Name must be at least 3 characters.")
                .Must(v => (v ?? string.Empty).Trim().Length <= 500)
                .WithMessage("Name must be at most 500 characters.");

            RuleFor(x => x.Duration)
                .Cascade(CascadeMode.Stop)
                .GreaterThan(0).WithMessage("Duration must be positive.")
                .LessThanOrEqualTo(60).WithMessage("Duration must be less then equal 60 hours");



        }
    }
}
