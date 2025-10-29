using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Application.Mappings {
    public class ServiceCategoryProfile : Profile {
        public ServiceCategoryProfile() {
             CreateMap<DataAccess.Dtos.ServiceCategory.ServiceCategoryCreateModel, DataAccess.Entities.ServiceCategory>();
        }
    }
}
