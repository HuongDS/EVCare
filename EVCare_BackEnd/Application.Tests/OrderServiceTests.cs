using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
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

        [Theory,AutoData]
        public async Task AddOrder_WithPartNotFound_ThrowsException
            (OrderPartAddModel model, int technicianId) {
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();

            model.Parts = new List<DataAccess.Dtos.Part.PartUpdateModel>
            {
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                    Id = 1,
                    Quantity = 2
                },
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                   Id = 2,
                    Quantity = 3
                }
            };

            partRepositoryMock.Setup(x => x.GetPartWithIDs(It.IsAny<List<int>>()))
                .ReturnsAsync(new Dictionary<int, DataAccess.Entities.Part>
                {
                    { 3, new DataAccess.Entities.Part { Id = 3, Name = "Part 3", Price = 10 } },
                    { 2, new DataAccess.Entities.Part { Id = 2, Name = "Part 2", Price = 20 } }
                });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.AddOrder(model, technicianId)
            );
            Assert.Equal("Part 1 not found",result.Message);




        }

        [Theory, AutoData]
        public async Task AddOrder_WithQuantityIsOutOfStock_ThrowsException
          (OrderPartAddModel model, int technicianId) {
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();

            model.Parts = new List<DataAccess.Dtos.Part.PartUpdateModel>
            {
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                    Id = 1,
                    Quantity = 200
                },
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                   Id = 2,
                    Quantity = 3
                }
            };

            partRepositoryMock.Setup(x => x.GetPartWithIDs(It.IsAny<List<int>>()))
                .ReturnsAsync(new Dictionary<int, DataAccess.Entities.Part>
                {
                    { 1, new DataAccess.Entities.Part { Id = 1, Name = "Part 1", Stock = 10 } },
                    { 2, new DataAccess.Entities.Part { Id = 2, Name = "Part 2", Stock = 20 } }
                });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.AddOrder(model, technicianId)
            );
            Assert.Equal("The part 'Part 1' doesn't have enough stock", result.Message);




        }

        [Theory, AutoData]
        public async Task AddOrder_WithValidDate_AddSucessfully
         (OrderPartAddModel model, int technicianId) {
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();

            model.Parts = new List<DataAccess.Dtos.Part.PartUpdateModel>
            {
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                    Id = 1,
                    Quantity = 2
                },
                new DataAccess.Dtos.Part.PartUpdateModel
                {
                   Id = 2,
                    Quantity = 3
                }
            };

            partRepositoryMock.Setup(x => x.GetPartWithIDs(It.IsAny<List<int>>()))
                .ReturnsAsync(new Dictionary<int, DataAccess.Entities.Part>
                {
                    { 1, new DataAccess.Entities.Part { Id = 1, Name = "Part 1", Stock = 10 } },
                    { 2, new DataAccess.Entities.Part { Id = 2, Name = "Part 2", Stock = 20 } }
                });
            
            var orderPartRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderPartRepository>>();
            orderPartRepositoryMock.Setup(x => x.AddRange(It.IsAny<List<OrderPart>>()))
                .Returns(Task.CompletedTask);

            var orderService = _fixture.Create<Application.Services.OrderService>();
            
            await orderService.AddOrder(model, technicianId);

            orderPartRepositoryMock.Verify(x => x.AddRange(It.IsAny<List<OrderPart>>()), Times.Once);
        }

    }
}
