using API.Filters;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Review;
using DataAccess.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        [ServiceFilter(typeof(CheckAuthorizationOfCustomerFilter))]
        public async Task<IActionResult> CreateReview(ReviewCreateModel model)
        {

            try
            {
                var result = await _reviewService.CreateAsync(model);
                return Ok(
                    new ResponseDto<int>
                    {
                        statusCode = HttpStatus.CREATED,
                        message = "Review created successfully",
                        data = result

                    });



            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [Authorize(Roles = "Customer")]
        [ServiceFilter(typeof(CheckAuthorizationOfCustomerFilter))]
        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetReviewByAppointment(int appointmentId)
        {
            try
            {
                var result = await _reviewService.GetByAppointmentId(appointmentId);
                return Ok(
                    new ResponseDto<ReviewViewDetailModel>
                    {
                        statusCode = HttpStatus.OK,
                        message = "Get review successfully",
                        data = result
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviews([FromQuery] ReviewQueryDto query)
        {

            try
            {
                var result = await _reviewService.GetAllReviews(query);
                return Ok(
                    new ResponseDto<PageResultDto<ReviewViewDetailModel>>
                    {
                        statusCode = HttpStatus.OK,
                        message = "Get reviews successfully",
                        data = result
                    });

            }
            catch (Exception ex)
            {
                return BadRequest(new ResponseDto<object>
                {
                    statusCode = HttpStatus.BAD_REQUEST,
                    message = ex.Message,
                });
            }
        }
    }
}
