using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
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
        private readonly IVehicleCategoryRepository _vehicleCategoryRepository;
        private readonly IMapper _mapper;
        public VehicleService(IVehicleRepository vehicleRepository, IMapper mapper,IVehicleCategoryRepository vehicleCategoryRepository)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
            _vehicleCategoryRepository = vehicleCategoryRepository;
        }
        public async Task<int> CreateVehicle(VehicleCreateModel model, int customerId)
        {
           
            var ok = await _vehicleRepository.CheckLicensePlate(model.LicensePlate);
            if (ok == true) throw new Exception("Licese Plate has exits");
            var vehicle = _mapper.Map<Vehicle>(model);
            vehicle.CustomerId = customerId;
            vehicle.Deleted_At = DateTime.MinValue;
            var createdVehicle = await _vehicleRepository.AddAsync(vehicle);
            return createdVehicle.Id;
            
           
        }

        public Task<VehicleDetailViewModel> GetVehicleDetailById(int vehicleId)
        {
            try
            {
                var vehicle = _vehicleRepository.GetVehicleDetailById(vehicleId);
                return _mapper.Map<Task<VehicleDetailViewModel>>(vehicle);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<IEnumerable<VehicleViewModel>> GetVehiclesByCustomerId(int customerId)
        {
            try
            {
                var vehicles = await _vehicleRepository.GetVehiclesByCustomerId(customerId);
                var datas =  _mapper.Map<IEnumerable<VehicleViewModel>>(vehicles);
                foreach(var data in datas)
                {
                   var vehicleCategory = await _vehicleCategoryRepository.GetByIdAsync(data.cateId);
                    if(vehicleCategory.Deleted_At!= DateTime.MinValue)
                    {
                        data.cateId = 0;
                    }
                }
                return datas;
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

        public async Task<int> UpdateVehicleStaff(VehicleStaffUpdateModel model)
        {
            
            var vehicle = await _vehicleRepository.GetByIdAsync(model.Id);
            if (vehicle == null) {
                throw new Exception(Message.VEHICLE_NOT_FOUND);
            }
             _mapper.Map(model, vehicle);
            vehicle.Last_Appointment = DateTime.UtcNow.AddHours(7);
            vehicle.NextServiceDate = DateTime.UtcNow.AddMonths(model.ReminderIntervalMonths);

            var createdVehicle = await _vehicleRepository.UpdateAsync(vehicle);
            return createdVehicle.Id;
           
        }
        public async Task SoftDeleteVehicle(int vehicleId)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
            if (vehicle == null)
            {
                throw new Exception(Message.VEHICLE_NOT_FOUND);
            }
            vehicle.Deleted_At = DateTime.Now;
            await _vehicleRepository.UpdateAsync(vehicle);
        }
    }
}
