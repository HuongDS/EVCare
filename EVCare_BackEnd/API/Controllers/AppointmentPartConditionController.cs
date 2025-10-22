using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentPartConditionController : ControllerBase {
       private readonly IAppointmentPartConditionService _appointmentPartConditionService;
         public AppointmentPartConditionController(IAppointmentPartConditionService appointmentPartConditionService) {
              _appointmentPartConditionService = appointmentPartConditionService;
        }

    }
}
