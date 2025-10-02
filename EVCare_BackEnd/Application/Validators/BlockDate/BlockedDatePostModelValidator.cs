using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.BlockedDate;
using FluentValidation;

namespace Application.Validators.BlockDate
{
    public class BlockedDatePostModelValidator : AbstractValidator<BlockedDatePostModel>
    {
        public BlockedDatePostModelValidator() {
        
            RuleFor(x=>x.Date).Must(x=>x>DateOnly.FromDateTime(DateTime.Now)).WithMessage("Date is not old");
            RuleFor(x => x.UnavailableType).NotNull().WithMessage("The Type is not null");
        }
    }
}
