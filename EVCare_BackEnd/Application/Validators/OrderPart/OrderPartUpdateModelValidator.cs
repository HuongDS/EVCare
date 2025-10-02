using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Part;
using DataAccess.Interfaces;
using FluentValidation;

namespace Application.Validators.Part
{
    public class OrderPartUpdateModelValidator : AbstractValidator<OrderPartUpdateModel>
    {
      
        public OrderPartUpdateModelValidator()
        {
            
            
            RuleFor(x => x.PartId).GreaterThan(0).WithMessage("Id must be positive");
            RuleFor(x => x.TechnicianId).GreaterThan(0).WithMessage("Id must be positive");
            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be positive");
            
            

        }
    }
}
