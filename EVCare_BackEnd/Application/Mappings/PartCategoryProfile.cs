using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.PartCategory;
using DataAccess.Entities;

namespace Application.Mappings
{
    public class PartCategoryProfile : Profile
    {
        public PartCategoryProfile()
        {
            CreateMap<PartCategoryCreateModel, PartCategory>();
        }
    }
}
