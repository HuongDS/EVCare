using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using DataAccess.Dtos.Review;
using DataAccess.Interfaces;

namespace Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        public ReviewService(IReviewRepository reviewRepository,IMapper mapper,IAppointmentRepository appointmentRepository)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
            _appointmentRepository = appointmentRepository;
        }
        public async Task<int> CreateAsync(ReviewCreateModel model)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(model.AppointmentId);
            if(appointment == null)
            {
                throw new Exception("Appointment not found");
            }
            if(appointment.Status != DataAccess.Enums.AppointmentStatusEnum.Done)
            {
                throw new Exception("You can only review completed appointments");
            }
            if (appointment.ReviewId != null)
            {
                throw new Exception("You have already reviewed this appointment");
            }
          
            var reviewEntity = _mapper.Map<DataAccess.Entities.Review>(model);
            var review =  await _reviewRepository.AddAsync(reviewEntity);
            appointment.ReviewId = review.Id;
            await _appointmentRepository.UpdateAsync(appointment);
            return review.Id;
        }
    }
}
