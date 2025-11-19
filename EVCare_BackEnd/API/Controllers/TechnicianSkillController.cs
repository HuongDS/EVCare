using Application.Interfaces;
using DataAccess.Dtos.TechnicianSkill;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicianSkillController : ControllerBase
    {
        private readonly ITechnicianSkillService _technicianSkillService;
        public TechnicianSkillController(ITechnicianSkillService technicianSkillService)
        {
            _technicianSkillService = technicianSkillService;
        }

        [HttpPost]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> AddTechnicianSkill(TechnicianSkillCreateModel model)
        {
            try
            {
                await _technicianSkillService.AddTechnicianSkillAsync(model);
                return Ok(new
                {
                    statusCode = StatusCodes.Status201Created,
                    message = "Technician skill added successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    message = ex.Message
                });
            }
        }
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTechnicianSkill([FromQuery]int techId,TechnicianSkillUpdateModel model)
        {
            try
            {
                await _technicianSkillService.UpdateTechnicianSkillAsync(model);
                return Ok(new
                {
                    statusCode = StatusCodes.Status200OK,
                    message = "Technician skill updated successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    message = ex.Message
                });
            }
        }

    }
}
