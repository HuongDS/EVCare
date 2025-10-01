using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Part;
using DataAccess.Interfaces;
using FluentValidation;

namespace Application.Validators.Part
{
    public class PartUpdateModelValidator : AbstractValidator<PartUpdateModel>
    {
        private readonly IPartRepository _partRepository;
        public PartUpdateModelValidator(IPartRepository partRepository)
        {
            _partRepository = partRepository;

            

        }
    }
}
