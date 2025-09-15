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
        // phải login mới dc xài
        [HttpPost]
        public async Task<IActionResult> CreateVehicle(VehicleCreateModel model)
        {
            try
            {
                var vehicleId = await _vehicleService.CreateVehicle(model);
                return Ok(new
                {
                    statusCode = 200,
                    message = "Vehicle created successfully",
                    data = vehicleId
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
           
        }

        // phải check customer có vehicle id đó không

        [HttpPut("customer/{id}")]
        public async Task<IActionResult> UpdateVehicle()
        {
            return null;
        }
    }
}
