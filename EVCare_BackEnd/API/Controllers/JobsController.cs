using System.Security.Cryptography;
using System.Text;
using Application.Interfaces;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("internal-jobs")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IAttendanceService _attendance;
        private readonly IReminderService _reminder;
        private readonly IAppointmentExpiryJob _expiry;
        private readonly IConfiguration _cfg;
        private readonly ILogger<JobsController> _logger;

        public JobsController(IAttendanceService a, IReminderService r, IAppointmentExpiryJob e,
                              IConfiguration cfg, ILogger<JobsController> logger)
        {
            _attendance = a;
            _reminder = r;
            _expiry = e;
            _cfg = cfg;
            _logger = logger;
        }

        bool IsValidKey(out string reason)
        {
            var provided = Request.Headers["X-Cron-Key"].FirstOrDefault()
                           ?? Request.Query["key"].FirstOrDefault();
            var expected = _cfg["CronKey"];
            if (string.IsNullOrEmpty(expected))
            {
                reason = "Server CronKey not configured.";
                return false;
            }
            if (string.IsNullOrEmpty(provided))
            {
                reason = "No CronKey provided.";
                return false;
            }
            if (!CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(provided), Encoding.UTF8.GetBytes(expected)))
            {
                reason = "Invalid CronKey.";
                return false;
            }
            reason = "";
            return true;
        }

        [HttpPost("attendance")]
        public async Task<IActionResult> Attendance()
        {
            if (!IsValidKey(out var r))
                return Unauthorized(new
                {
                    error = r
                });
            await _attendance.MarkAttendanceAsync();
            return Ok(new
            {
                ok = true
            });
        }

        [HttpPost("reminder")]
        public async Task<IActionResult> Reminder()
        {
            if (!IsValidKey(out var r))
                return Unauthorized(new
                {
                    error = r
                });
            await _reminder.SendEmailRemindersAsync();
            return Ok(new
            {
                ok = true
            });
        }

        [HttpPost("cancel-expired")]
        public IActionResult CancelExpired()
        {
            if (!IsValidKey(out var r))
                return Unauthorized(new
                {
                    error = r
                });
            BackgroundJob.Enqueue<IAppointmentExpiryJob>(j => j.CancelAppointment());
            return Ok(new
            {
                enqueued = true
            });
        }
    }
}
