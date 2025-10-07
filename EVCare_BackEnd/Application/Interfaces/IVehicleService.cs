using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Vehicle;

namespace Application.IService
{
    public interface IVehicleService
    {
        Task<int> CreateVehicle(VehicleCreateModel model, int customerId);
        Task<VehicleDetailViewModel> GetVehicleDetailById(int vehicleId);
        Task<IEnumerable<VehicleViewModel>> GetVehiclesByCustomerId(int customerId);
        Task<int> UpdateVehicleCustomer(VehicleCustomerUpdateModel model);
        Task<int> UpdateVehicleStaff(VehicleStaffUpdateModel model);
    }
}
