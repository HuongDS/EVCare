using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("internal-jobs")]
    public class JobController : ControllerBase
    {
        private readonly IAttendanceService _attendance;
        private readonly IReminderService _reminder;
        private readonly IAppointmentExpiryJob _appointmentExpiry;
        private readonly string _key;

        public JobController(
            IConfiguration cfg,
            IAttendanceService attendance,
            IReminderService reminder,
            IAppointmentExpiryJob appointmentExpiry)
        {
            _attendance = attendance;
            _reminder = reminder;
            _appointmentExpiry = appointmentExpiry;
            _key = cfg["CronKey"]!;
        }

        private bool IsValidKey(string? provided) => provided == _key;

        [HttpPost("attendance")]
        public async Task<IActionResult> Attendance([FromHeader(Name = "X-Cron-Key")] string? key)
        {
            if (!IsValidKey(key))
                return Unauthorized();
            await _attendance.MarkAttendanceAsync();
            return Ok(new
            {
                ok = true
            });
        }

        [HttpPost("cancel-expired")]
        public async Task<IActionResult> CancelExpired([FromHeader(Name = "X-Cron-Key")] string? key)
        {
            if (!IsValidKey(key))
                return Unauthorized();
            await _appointmentExpiry.CancelAppointment();
            return Ok(new
            {
                ok = true
            });
        }

        [HttpPost("reminder")]
        public async Task<IActionResult> Reminder([FromHeader(Name = "X-Cron-Key")] string? key)
        {
            if (!IsValidKey(key))
                return Unauthorized();
            await _reminder.SendEmailRemindersAsync();
            return Ok(new
            {
                ok = true
            });
        }
    }
}
