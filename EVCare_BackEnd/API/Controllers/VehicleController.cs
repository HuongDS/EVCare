using Application.IService;
using DataAccess.Dtos.Vehicle;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;   
        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateVehicle(VehicleCreateModel model)
        {
            var vehicleId = await _vehicleService.CreateVehicle(model);
            return Ok(new
            {
                statusCode = 200,
                message = "Vehicle created successfully",
                data = vehicleId
            });
        }
    }
}
