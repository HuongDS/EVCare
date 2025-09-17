using Application.Interfaces;
using DataAccess.Dtos.Appointment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;   
        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }
        [Authorize(Roles = "Staff")]
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(AppointmentCreateModel model)
        {
            try
            {
                var appointmentId = await _appointmentService.CreateAppointment(model);
                return Ok(new
                {
                    StatusCode = 200,
                    Message = "Appointment created successfully",
                    AppointmentId = appointmentId
                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    message = "Something went wrong",
                });
            }
        }

    }
}
