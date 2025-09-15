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
        Task<int> CreateVehicle(VehicleCreateModel model);

    }
}
