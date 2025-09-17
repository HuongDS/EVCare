using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess.Dtos.Employees;
using DataAccess.Dtos.Register;

namespace Application.Mappings
{
    public class RegisterProfile : Profile
    {
        public RegisterProfile()
        {
            CreateMap<EmployeeRegisterDto, RegisterRequestDto>();
        }
    }
}
