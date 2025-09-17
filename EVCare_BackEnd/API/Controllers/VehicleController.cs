using API.Filters;
using Application.Dtos;
using Application.IService;
using DataAccess.Dtos.Vehicle;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
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
        [ServiceFilter(typeof(SetCustomerIdFilter))]
        public async Task<IActionResult> CreateVehicle(VehicleCreateModel model)
        {
            try
            {
                var customerId = (int)HttpContext.Items["CustomerId"];
                var vehicleId = await _vehicleService.CreateVehicle(model,customerId);
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
        [HttpPut("customer")]
        [ServiceFilter(typeof(AuthorizeVehicleOwnerFilter))]
        public async Task<IActionResult> UpdateVehicle(VehicleCustomerUpdateModel model)
        {
            try
            {
               // var customerId = (int)HttpContext.Items["CustomerId"];
                var result = await _vehicleService.UpdateVehicleCustomer(model);
                return Ok(new ResponseDto<int>
                {
                    statusCode = 200,
                    message = "Vehicle updated successfully",
                    data = result
                });


            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }
        [HttpGet("customer/{customerId}")]
        [ServiceFilter(typeof(AuthorizeCustomerOrAdminFilter))]
        public async Task<IActionResult> GetVehiclesByCustomerId(int customerId)
        {
            try
            {
                IEnumerable<VehicleViewModel> vehicles = await _vehicleService.GetVehiclesByCustomerId(customerId);
                return Ok(new ResponseDto<IEnumerable<VehicleViewModel>>
                {
                    statusCode = 200,
                    message = "Success",
                    data = vehicles
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = 400,
                    message = ex.Message
                });
            }
        }
        [HttpGet("{vehicleId}")]
        public async Task<IActionResult> GetVehicleById(int vehicleId)
        {
            return Ok();
        }
    }
}
