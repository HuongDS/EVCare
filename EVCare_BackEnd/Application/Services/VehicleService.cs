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
        public async Task<int> CreateVehicle(VehicleCreateModel model, int customerId)
        {
            try
            {
                var vehicle = _mapper.Map<Vehicle>(model);
                vehicle.CustomerId = customerId;
                var createdVehicle = await _vehicleRepository.AddAsync(vehicle);
                return createdVehicle.Id;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            
        }

        public Task<VehicleDetailViewModel> GetVehicleDetailById(int vehicleId)
        {
            try
            {
                var vehicle =  _vehicleRepository.GetVehicleDetailById(vehicleId);
                return _mapper.Map<Task<VehicleDetailViewModel>>(vehicle);

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesByCustomerId(int customerId)
        {
            try
            {
                var vehicles = await _vehicleRepository.GetVehiclesByCustomerId(customerId);
                return _mapper.Map<IEnumerable<VehicleViewModel>>(vehicles);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> UpdateVehicleCustomer(VehicleCustomerUpdateModel model)
        {
            try
            {
                var vehicle =await _vehicleRepository.GetByIdAsync(model.Id);
                vehicle = _mapper.Map(model, vehicle);

                var createdVehicle = await _vehicleRepository.UpdateAsync(vehicle);
                return createdVehicle.Id;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> UpdateVehicleStaff(VehicleStaffUpdateModel model)
        {
            try
            {
                var vehicle = await _vehicleRepository.GetByIdAsync(model.Id);
                vehicle = _mapper.Map(model, vehicle);

                var createdVehicle = await _vehicleRepository.UpdateAsync(vehicle);
                return createdVehicle.Id;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
