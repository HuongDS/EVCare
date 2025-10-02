using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Vehicle;
using FluentValidation;

namespace Application.Validators.Vehicle
{
    public class CreateVehivleModelValidator : AbstractValidator<VehicleCreateModel>
    {
        public CreateVehivleModelValidator() {

            RuleFor(x => x.CategoryId).NotNull().GreaterThan(0).WithMessage("Id must be positive");
            RuleFor(x => x.LicensePlate)
               .NotEmpty().WithMessage("License plate is required")
               .Matches(@"^(?:\d{2}[A-Z]-?\d{4,5}|\d{2}[A-Z]{2}-?\d{4,5}|\d{2}[A-Z]-?\d{3}\.\d{2})$")
               .WithMessage("Invalid license plate format (ex: 29A-12345, 30AB-1234, 59A-123.45)");
        }
    }
}
