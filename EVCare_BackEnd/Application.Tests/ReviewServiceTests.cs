using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Review;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class ReviewServiceTests {
        private readonly IFixture _fixture;
        public ReviewServiceTests() {
            _fixture = new Fixture().Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory, AutoData]
        public async Task CreateAsync_AppointmentNotFound_ShouldThrowException(
            ReviewCreateModel model
            ) {

            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(model.AppointmentId))
                .ReturnsAsync((DataAccess.Entities.Appointment?)null);
            _fixture.Inject(appointmentRepository.Object);
            var reviewService = _fixture.Create<Application.Services.ReviewService>();

            var result = await Assert.ThrowsAsync<Exception>(async () => await reviewService.CreateAsync(model));

            Assert.Equal("Appointment not found", result.Message);
        }
        [Theory, AutoData]
        public async Task CreateAsync_AppointmentStatusIsNotDone_ShouldThrowException(
          ReviewCreateModel model
          ) {

            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(model.AppointmentId))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = model.AppointmentId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.Confirmed,
                });
            _fixture.Inject(appointmentRepository.Object);
            var reviewService = _fixture.Create<Application.Services.ReviewService>();

            var result = await Assert.ThrowsAsync<Exception>(async () => await reviewService.CreateAsync(model));

            Assert.Equal("You can only review completed appointments", result.Message);
        }
        [Theory, AutoData]
        public async Task CreateAsync_AppointmentHavedReview_ShouldThrowException(
          ReviewCreateModel model
          ) {

            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(model.AppointmentId))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = model.AppointmentId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.Done,
                    ReviewId = 1
                });
            _fixture.Inject(appointmentRepository.Object);
            var reviewService = _fixture.Create<Application.Services.ReviewService>();

            var result = await Assert.ThrowsAsync<Exception>(async () => await reviewService.CreateAsync(model));

            Assert.Equal("You have already reviewed this appointment", result.Message);
        }
        [Theory, AutoData]
        public async Task CreateAsync_AppointmentValid_ReturnsReviewId(
          ReviewCreateModel model
          ) {

            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(model.AppointmentId))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = model.AppointmentId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.Done,

                });
            appointmentRepository.Setup(x => x.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appt) => appt);
            _fixture.Inject(appointmentRepository.Object);

            var mapperMock = new Mock<AutoMapper.IMapper>();
            mapperMock.Setup(m => m.Map<DataAccess.Entities.Review>(It.IsAny<ReviewCreateModel>()))
                .Returns(new DataAccess.Entities.Review
                {
                    Id = 1,
                    AppointmentId = model.AppointmentId,
                    Rating = model.Rating,
                    Content = model.Content,
                    Create_At = DateTime.UtcNow
                });
            _fixture.Inject(mapperMock.Object);
            var reviewRepository = new Mock<IReviewRepository>();
            reviewRepository.Setup(x => x.AddAsync(It.IsAny<DataAccess.Entities.Review>()))
                .ReturnsAsync((DataAccess.Entities.Review review) =>
                {
                    review.Id = 1;
                    return review;
                });
            _fixture.Inject(reviewRepository.Object);

            var reviewService = _fixture.Create<Application.Services.ReviewService>();
            var result = await reviewService.CreateAsync(model);
            Assert.Equal(1, result);
        }
        [Theory, AutoData]
        public async Task GetByAppointmentId_AppointmentNotFound_ShouldThrowException(
            int appointmentId
            ) {
            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(appointmentId))
                .ReturnsAsync((DataAccess.Entities.Appointment?)null);
            _fixture.Inject(appointmentRepository.Object);
            var reviewService = _fixture.Create<Application.Services.ReviewService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => await reviewService.GetByAppointmentId(appointmentId));
            Assert.Equal("Appointment not found", result.Message);

        }
        [Theory, AutoData]
        public async Task GetByAppointmentId_AppointmentValid_ReturnsReviewViewDetailModel(
            int appointmentId,
            ReviewViewDetailModel expectedReview
            ) {
            var appointmentRepository = new Mock<IAppointmentRepository>();
            appointmentRepository.Setup(x => x.GetByIdAsync(appointmentId))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = appointmentId,
                    Status = DataAccess.Enums.AppointmentStatusEnum.Done,
                    ReviewId = 1
                });
            _fixture.Inject(appointmentRepository.Object);
            var reviewRepository = new Mock<IReviewRepository>();
            reviewRepository.Setup(x => x.GetByAppointmentId(appointmentId))
                .ReturnsAsync(expectedReview);
            _fixture.Inject(reviewRepository.Object);
            var reviewService = _fixture.Create<Application.Services.ReviewService>();
            var result = await reviewService.GetByAppointmentId(appointmentId);
            Assert.Equal(expectedReview, result);
        }

     }
}
