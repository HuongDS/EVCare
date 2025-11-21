using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Dtos.Pagination;
using DataAccess.Dtos.Review;
using DataAccess.Entities;
using DataAccess.Helpers;
using DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(EVCareDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<PageResultDto<ReviewViewDetailModel>> GetAllReviews(ReviewQueryDto query)
        {
            var reviewsQuery = _dbContext.Reviews.AsNoTracking()
                .Include(x=>x.Appointment).ThenInclude(x=>x.Customer).ThenInclude(x=>x.Account)
                .Include(x=>x.Appointment).ThenInclude(x=>x.AppointmentServices).ThenInclude(x=>x.Service)
                .Select(x=>new ReviewViewDetailModel
                {
                    Id = x.Id,
                    Rating = x.Rating,
                    Content = x.Content,
                    CreatedAt = x.Create_At,
                    CustomerName = x.Appointment.Customer.Account.First_Name + " " + x.Appointment.Customer.Account.Last_Name,
                    Services = x.Appointment.AppointmentServices
                        .Select(asg => new DataAccess.Dtos.Service.ServiceViewFormModel
                        {
                            Id = asg.Service.Id,
                            Name = asg.Service.Name,
                        }).ToList()
                })
                .Where(x=>x.Rating >= query.MinRating && x.Rating <= query.MaxRating)
                ;
            if (query.ServiceIds != null && query.ServiceIds.Any())
            {
                reviewsQuery = reviewsQuery
                    .Where(r => r.Services.Any(s => query.ServiceIds.Contains(s.Id)));
            }
           reviewsQuery =  reviewsQuery.ApplySorting(query.SortField, query.SortOrder);

            return await PaginationHelper.PaginationAsync(reviewsQuery, query.PageSize.Value ,query.PageIndex.Value);




        }

        public async Task<ReviewViewDetailModel> GetByAppointmentId(int appointmentId)
        {
            return await _dbContext.Reviews
                .Where(r => r.AppointmentId == appointmentId)
                .Select(r => new ReviewViewDetailModel
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Content = r.Content,
                    CreatedAt = r.Create_At,
                    CustomerName = r.Appointment.Customer.Account.First_Name  + " " + r.Appointment.Customer.Account.Last_Name,
                    Services = r.Appointment.AppointmentServices
                        .Select(asg => new DataAccess.Dtos.Service.ServiceViewFormModel
                        {
                            Id = asg.Service.Id,
                            Name = asg.Service.Name,
                        }).ToList()
                })
                .FirstOrDefaultAsync();
        }
    }
}
