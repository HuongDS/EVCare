using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Appointment;
using FluentValidation;

namespace Application.Validators.Appointment
{
    public class AppointmentCustomerCreateModelValidator : AbstractValidator<AppointmentCustomerCreateModel>
    {
        public AppointmentCustomerCreateModelValidator() { 
        
        
           RuleFor(x=>x.VehicleId).GreaterThan(0).WithMessage("VehicleId is a positive");
           RuleFor(x=>x.Appointment_Date).NotNull().WithMessage("Date must not empty");
           RuleFor(x=>x.Appointment_Date).Must(x=>x>DateTime.Now).WithMessage("Date is old");
           RuleFor(x => x.ServiceIds).NotNull().WithMessage("Services must not null");
        
        }
    }
}
