using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Infrastructures;
using Application.Services;
using AutoFixture;
using AutoFixture.AutoMoq;
using AutoFixture.Xunit2;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Interfaces;
using Moq;

namespace Application.Tests {
    public class OrderServiceTests {
        private readonly IFixture _fixture;
        public OrderServiceTests() {
            _fixture = new Fixture()
                .Customize(new AutoMoqCustomization { ConfigureMembers = false });
        }
        [Theory, AutoData]
        public async Task CreateOrderAsync_WithNonExitsAppointment_ThrowsException(OrderCreateRequestDto data) {
            var appointmentRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IAppointmentRepository>>();
            appointmentRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((DataAccess.Entities.Appointment?)null);

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
            mapperMock.Setup(x => x.Map<DataAccess.Entities.Order>(It.IsAny<OrderCreateRequestDto>()))
                .Returns(new DataAccess.Entities.Order
                {
                    Id = 1,
                    Create_At = DateTime.Now,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending

                });
            mapperMock.Setup(x => x.Map<OrderResponseDto>(It.IsAny<DataAccess.Entities.Order>()))
                .Returns(new OrderResponseDto
                {
                    orderID = 1

                });
            var appointmentRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IAppointmentRepository>>();
            appointmentRepositoryMock.Setup(x => x.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Entities.Appointment
                {
                    Id = 1,
                    Appointment_Date = DateTime.Now,
                    Status = DataAccess.Enums.AppointmentStatusEnum.CheckedIn,
                    CustomerId = 1,
                    VehicleId = 1
                });
            appointmentRepositoryMock.Setup(t => t.AddAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);
            appointmentRepositoryMock.Setup(t => t.UpdateAsync(It.IsAny<DataAccess.Entities.Appointment>()))
                .ReturnsAsync((DataAccess.Entities.Appointment appointment) => appointment);

            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await orderService.CreateOrderAsync(data);
            Assert.NotNull(result);
            Assert.Equal(1, result.data.orderID);
            Assert.Equal(200, result.statusCode);



        }

        [Theory, AutoData]
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
            Assert.Equal("Part 1 not found", result.Message);




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

        [Theory, AutoData]
        public async Task AddPartsToAnOrder_WithOrderNotFound_ThrowsException(OrderPartAddModel model, int technicianId) {
            var techncianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            techncianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync((DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel?)null);
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.AddPartsToAnOrder(model, technicianId)
            );
            Assert.Equal("Source not found", result.Message);

        }
        [Theory, AutoData]
        public async Task AddPartsToAnOrder_WithOrderStatusIsDifferentAddingPart_ThrowsException(OrderPartAddModel model, int technicianId) {
            var techncianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            techncianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
               .ReturnsAsync(new DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel
               {
                   Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Pending
               });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.AddPartsToAnOrder(model, technicianId)
            );
            Assert.Equal("You are only updated when in adding part status", result.Message);

        }
        [Theory, AutoData]
        public async Task AddPartsToAnOrder_WithValidData_AddSuccessfully(OrderPartAddModel model, int technicianId) {
            var techncianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            techncianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
               .ReturnsAsync(new DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel
               {
                   Status = DataAccess.Enums.TechnicianWorkingSessionEnum.AddingPart
               });
            var uowMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            uowMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());

            var orderService = new Mock<OrderService>(
                _fixture.Create<DataAccess.Interfaces.IOrderRepository>(),
                _fixture.Create<DataAccess.Interfaces.IAppointmentRepository>(),
                _fixture.Create<AutoMapper.IMapper>(),
                _fixture.Create<DataAccess.Interfaces.IOrderPartRepository>(),
                _fixture.Create<DataAccess.Interfaces.IPartRepository>(),
                uowMock.Object,
                techncianWorkingSessionRepositoryMock.Object
            )
            { CallBase = true };
            orderService.Setup(t => t.AddOrder(model, technicianId)).Returns(Task.CompletedTask);


            await orderService.Object.AddPartsToAnOrder(model, technicianId);
            uowMock.Verify(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()), Times.Once);

        }

        [Theory, AutoData]
        public async Task UpdatePartToOrder_OrderIdAndTechnicianIdNotFound_ThrowsException(OrderPartAddModel model, int technicianId) {

            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync((DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel?)null);
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdatePartToOrder(model, technicianId)
            );
            Assert.Equal("Source not found", result.Message);

        }
        [Theory, AutoData]
        public async Task UpdatePartToOrder_SessionIsNotAddingPart_ThrowsException(OrderPartAddModel model, int technicianId) {

            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel
                {
                    Status = DataAccess.Enums.TechnicianWorkingSessionEnum.Pending
                });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdatePartToOrder(model, technicianId)
            );
            Assert.Equal("You are only updated when in adding part status", result.Message);

        }
        [Theory, AutoData]
        public async Task UpdatePartToOrder_ValidData_UpdateSuccessfully(OrderPartAddModel model, int technicianId) {
            var technicianWorkingSessionRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.ITechnicianWorkingSessionRepository>>();
            technicianWorkingSessionRepositoryMock.Setup(x => x.GetTechnicianWorkingSession(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(new DataAccess.Dtos.Technician.TechnicianWorkingSessionViewModel
                {
                    Status = DataAccess.Enums.TechnicianWorkingSessionEnum.AddingPart
                });
            var uowMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            uowMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            var orderPartRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderPartRepository>>();
            orderPartRepositoryMock.Setup(x => x.GetOrderPart(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(new List<DataAccess.Entities.OrderPart>()
                {
                    new DataAccess.Entities.OrderPart
                    {

                        OrderId = model.OrderId,
                        PartId = 1,
                        Quantity = 2,
                        TechnicianId = technicianId
                    },
                    new DataAccess.Entities.OrderPart
                    {

                        OrderId = model.OrderId,
                        PartId = 2,
                        Quantity = 3,
                        TechnicianId = technicianId
                    }
                });
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();
            partRepositoryMock.Setup(x => x.GetPartWithIDs(It.IsAny<List<int>>()))
                .ReturnsAsync(new Dictionary<int, DataAccess.Entities.Part>
                {
                    { 1, new DataAccess.Entities.Part { Id = 1, Name = "Part 1", Stock = 10 } },
                    { 2, new DataAccess.Entities.Part { Id = 2, Name = "Part 2", Stock = 20 } }
                });
            orderPartRepositoryMock.Setup(x => x.RemoveRange(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            var orderService = new Mock<OrderService>(
                _fixture.Create<DataAccess.Interfaces.IOrderRepository>(),
                _fixture.Create<DataAccess.Interfaces.IAppointmentRepository>(),
                _fixture.Create<AutoMapper.IMapper>(),
                orderPartRepositoryMock.Object,
                partRepositoryMock.Object,
                uowMock.Object,
                technicianWorkingSessionRepositoryMock.Object
            )
            { CallBase = true };
            orderService.Setup(t => t.AddOrder(model, technicianId)).Returns(Task.CompletedTask);

            await orderService.Object.UpdatePartToOrder(model, technicianId);
            uowMock.Verify(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()), Times.Once);
            orderPartRepositoryMock.Verify(x => x.RemoveRange(It.IsAny<int>(), It.IsAny<int>()), Times.Once);
            orderService.Verify(x => x.AddOrder(model, technicianId), Times.Once);

        }

        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithNonExitsOrder_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((DataAccess.Entities.Order?)null);
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal($"The Order {model.Id} doesn't not exist", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithOrderIsCancel_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Canceled
                });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal($"The Order {model.Id} haved canceled or completed", result.Message);
        }
        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithOrderIsCompleted_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Completed
                });
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = await Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal($"The Order {model.Id} haved canceled or completed", result.Message);
        }

        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithPartIsNotFoundInStock_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending
                });
            
            var unitOfWorkMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            unitOfWorkMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            orderRepository.Setup(o => o.GetOrderPartsByOrderId(model.Id))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart { PartId = 1, Quantity = 2 },
                        new OrderPart { PartId = 2, Quantity = 3 }
                    }
                });
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();
            partRepositoryMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(()=>null);
            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal("Part 1 not found", result.Result.Message);

        }

        [Theory,AutoData]
        public async Task UpdateOrderAsync_WithPartInModelNotFound_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending
                });
            orderRepository.Setup(t => t.RemoveOrderPartsAsync(It.IsAny<int>())).Returns(Task.CompletedTask);

            var unitOfWorkMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            unitOfWorkMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            orderRepository.Setup(o => o.GetOrderPartsByOrderId(model.Id))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart { PartId = 1, Quantity = 2 },
                        new OrderPart { PartId = 2, Quantity = 3 }
                    }
                });
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();
            partRepositoryMock
                     .SetupSequence(x => x.GetByIdAsync(It.IsAny<int>()))
                     .ReturnsAsync(new Part { Id = 10, Stock = 5 })   
                     .ReturnsAsync(new Part { Id = 11, Stock = 5 })  
                     .ReturnsAsync((Part?)null);
            model.OrderParts = new List<OrderPartUpdateModel>
            {
                new OrderPartUpdateModel
                {
                    PartId = 5,
                    Quantity = 5
                },
            };

            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal("Part 5 not found", result.Result.Message);
        }

        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithPartInModelIsOutOfStock_ThrowsException(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending
                });
            orderRepository.Setup(t => t.RemoveOrderPartsAsync(It.IsAny<int>())).Returns(Task.CompletedTask);

            var unitOfWorkMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            unitOfWorkMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            orderRepository.Setup(o => o.GetOrderPartsByOrderId(model.Id))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart { PartId = 1, Quantity = 2 },
                        new OrderPart { PartId = 2, Quantity = 3 }
                    }
                });
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();
            partRepositoryMock
                     .SetupSequence(x => x.GetByIdAsync(It.IsAny<int>()))
                     .ReturnsAsync(new Part { Id = 10, Stock = 5 })
                     .ReturnsAsync(new Part { Id = 11, Stock = 5 })
                     .ReturnsAsync(new Part { Id = 12,Stock = 4});
            model.OrderParts = new List<OrderPartUpdateModel>
            {
                new OrderPartUpdateModel
                {
                    PartId = 5,
                    Quantity = 5
                },
            };

            var orderService = _fixture.Create<Application.Services.OrderService>();
            var result = Assert.ThrowsAsync<Exception>(async () =>
                await orderService.UpdateOrderAsync(model)
            );
            Assert.Equal("Part 5 doesn't have enough stock", result.Result.Message);
        }

        [Theory, AutoData]
        public async Task UpdateOrderAsync_WithValidData_UpdateSuccessfully(OrderUpdateModel model) {
            var orderRepository = _fixture.Freeze<Mock<DataAccess.Interfaces.IOrderRepository>>();
            orderRepository.Setup(t => t.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    Status = DataAccess.Enums.OrderStatusEnum.Pending
                });
            orderRepository.Setup(t => t.RemoveOrderPartsAsync(It.IsAny<int>())).Returns(Task.CompletedTask);
            orderRepository.Setup(t=>t.AddOrderPartAsync(It.IsAny<OrderPart>())).Returns(Task.CompletedTask);
            var unitOfWorkMock = _fixture.Freeze<Mock<IUnitOfWork>>();
            unitOfWorkMock
                .Setup(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()))
                .Returns<Func<Task>>(action => action());
            orderRepository.Setup(o => o.GetOrderPartsByOrderId(model.Id))
                .ReturnsAsync(new Order
                {
                    Id = model.Id,
                    OrderParts = new List<OrderPart>
                    {
                        new OrderPart { PartId = 1, Quantity = 2 },
                        new OrderPart { PartId = 2, Quantity = 3 }
                    }
                });
            var partRepositoryMock = _fixture.Freeze<Mock<DataAccess.Interfaces.IPartRepository>>();
            partRepositoryMock
                     .SetupSequence(x => x.GetByIdAsync(It.IsAny<int>()))
                     .ReturnsAsync(new Part { Id = 10, Stock = 5 })
                     .ReturnsAsync(new Part { Id = 11, Stock = 5 })
                     .ReturnsAsync(new Part { Id = 10, Stock = 5 })
                      .ReturnsAsync(new Part {Id = 11 ,Stock = 5 })
                      .ReturnsAsync(new Part { Id = 12, Stock = 5 });
            model.OrderParts = new List<OrderPartUpdateModel>
            {
                new OrderPartUpdateModel
                {
                    PartId = 10,
                    Quantity = 2
                },
                new OrderPartUpdateModel
                {
                    PartId = 11,
                    Quantity = 3
                },
                new OrderPartUpdateModel
                {
                    PartId = 12,
                    Quantity = 4
                }
            };
            var orderService = _fixture.Create<Application.Services.OrderService>();
            await orderService.UpdateOrderAsync(model);
            unitOfWorkMock.Verify(u => u.ExecuteInTransactionAsync(It.IsAny<Func<Task>>()), Times.Once);
            orderRepository.Verify(x => x.RemoveOrderPartsAsync(It.IsAny<int>()), Times.Once);
        }
     }
}
