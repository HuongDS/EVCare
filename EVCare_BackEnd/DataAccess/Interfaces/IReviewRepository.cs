using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Review;
using DataAccess.Entities;

namespace DataAccess.Interfaces
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<PageResultDto<ReviewViewDetailModel>> GetAllReviews(ReviewQueryDto query);
        Task<ReviewViewDetailModel> GetByAppointmentId(int appointmentId);
    }
}
