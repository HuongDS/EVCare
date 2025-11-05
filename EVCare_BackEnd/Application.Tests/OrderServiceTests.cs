using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.Orders;
using Moq;

namespace Application.Tests {
    public class OrderServiceTests {
        private readonly IFixture _fixture;
        public OrderServiceTests() {
            _fixture = new Fixture()
                .Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory,AutoData]
        public async Task CreateOrderAsync_WithNonExitsAppointment_ThrowsException(OrderCreateRequestDto data) {
            var appointmentRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IAppointmentRepository>>();
            appointmentRepository.Setup(t=>t.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((DataAccess.Entities.Appointment?)null);   

            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () => 
                await orderService.CreateOrderAsync(data)
            );
            Assert.Equal(Message.APPOINTMENT_NOT_FOUND, result.Message);

        }
        [Theory, AutoData]
        public async Task CreateOrderAsync_WithExitsAppointment_ThrowsException(OrderCreateRequestDto data) {
            var appointmentRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IAppointmentRepository>>();
            appointmentRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    Appointment_Date = DateTime.Now,
                    Status = DataAccess.Enums.AppointmentStatusEnum.CheckedIn,
                    CustomerId = 1,
                    VehicleId = 1
                });

            var mapperMock = _fixture.Freeze<Mock<AutoMapper.IMapper>>();
            mapperMock.Setup(x=>x.Map<DataAccess.Entities.Order>(It.IsAny<OrderCreateRequestDto>()))
                .Returns(new DataAccess.Entities.Order
                {
                    Id = 1,
                    Create_At = DateTime.Now,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending
                    
                });
            mapperMock.Setup(x=>x.Map<OrderResponseDto>(It.IsAny<DataAccess.Entities.Order>()))
                .Returns(new OrderResponseDto
                {
                   orderID = 1
                  
                });
            var appointmentRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x=>x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    Appointment_Date = DateTime.Now,
                    Status = DataAccess.Enums.AppointmentStatusEnum.CheckedIn,
                    CustomerId = 1,
                    VehicleId = 1
                });
            appointmentRepositoryMock.Setup(t=>t.AddAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);
            appointmentRepositoryMock.Setup(t=>t.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);

            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await orderService.CreateOrderAsync(data);
            Assert.NotNull(result);
            Assert.Equal(1, result.data.orderID);
            Assert.Equal(200,result.statusCode);



        }
        

    
    }
}
