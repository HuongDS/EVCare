using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.IService;
using AutoMapper;
using DataAccess.Dtos.Vehicle;
using DataAccess.Entities;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository; 
        private readonly IMapper _mapper;
        public VehicleService(IVehicleRepository vehicleRepository,IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }
        public async Task<int> CreateVehicle(VehicleCreateModel model)
        {
            var vehicle = _mapper.Map<Vehicle>(model);
            var createdVehicle = await _vehicleRepository.AddAsync(vehicle);
            return createdVehicle.Id;
        }
    }
}
