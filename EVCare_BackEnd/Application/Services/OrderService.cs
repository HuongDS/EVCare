using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using Application.Infrastructures;
using Application.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Actions;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;
using DataAccess.Enums;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Order = DataAccess.Entities.Order;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IMapper _mapper;
        private readonly IOrderPartRepository _orderPartRepository;
        private readonly IPartRepository _partRepository;
        private readonly ITechnicianWorkingSessionRepository _technicianWorkingSessionRepository;
        private readonly IAppointmentPartConditionRepository _appointmentPartConditionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceCenterRepository _serviceCenterRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IOrderDetailLogService _orderDetailLogService;
        private readonly IEmployeeRepository _employeeRepository;
        public OrderService(IOrderRepository orderRepository,
            IAppointmentRepository appointmentRepository,
            IMapper mapper, IOrderPartRepository orderPartRepository, IPartRepository partRepository, IUnitOfWork unitOfWork
            , ITechnicianWorkingSessionRepository technicianWorkingSessionRepository
            , IAppointmentPartConditionRepository appointmentPartConditionRepository,
            IServiceCenterRepository serviceCenterRepository,
            IAccountRepository accountRepository,
            IOrderDetailLogService orderDetailLogService,
            IEmployeeRepository employeeRepository
            )
        {
            _orderRepository = orderRepository;
            _appointmentRepository = appointmentRepository;
            _mapper = mapper;
            _orderPartRepository = orderPartRepository;
            _partRepository = partRepository;
            _unitOfWork = unitOfWork;
            _technicianWorkingSessionRepository = technicianWorkingSessionRepository;
            _appointmentPartConditionRepository = appointmentPartConditionRepository;
            _serviceCenterRepository = serviceCenterRepository;
            _accountRepository = accountRepository;
            _orderDetailLogService = orderDetailLogService;  
            _employeeRepository = employeeRepository;
        }
        public async Task<ResponseDto<OrderResponseDto>> CreateOrderAsync(OrderCreateRequestDto data)
        {



            var checkAppointment = await _appointmentRepository.GetByIdAsync(data.appointmentID);
            if (checkAppointment is null)
            {
                throw new Exception(Message.APPOINTMENT_NOT_FOUND);
            }
            var serviceCenter = await _serviceCenterRepository.GetCenterInforAsync();
            var newOrder = _mapper.Map<Order>(data);
            newOrder.Vat = serviceCenter.Vat;
            var addedEntity = await _orderRepository.AddAsync(newOrder);
            var appointment = await _appointmentRepository.GetByIdAsync(data.appointmentID);
            appointment.OrderId = addedEntity.Id;
            await _appointmentRepository.UpdateAsync(appointment);
            return new ResponseDto<OrderResponseDto>
            {
                statusCode = 200,
                message = Message.ORDER_CREATED_SUCCESS,
                data = _mapper.Map<OrderResponseDto>(addedEntity)
            };
        }
        public async Task<ResponseDto<OrderPartsViewDto>> AddPartsToOrder(List<OrderPartAddDto> data, int orderId)
        {
            var checkOrderID = await _orderRepository.GetByIdAsync(orderId);
            if (checkOrderID is null)
            {
                throw new Exception(Message.ORDER_NOT_FOUND);
            }
            var orderParts = _mapper.Map<List<OrderPart>>(data);

            try
            {
                foreach (var item in orderParts)
                {
                    await _partRepository.UpdateStockPartAsync(item.PartId, item.Quantity);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            await _orderPartRepository.AddRangeAsync(orderParts);
            var listParts = _mapper.Map<OrderPartsViewDto>(data);

            return new ResponseDto<OrderPartsViewDto>
            {
                statusCode = 200,
                message = Message.ORDER_PARTS_ADDED_SUCCESS,
                data = listParts,
            };
        }
        public async Task<ResponseDto<OrderResponseDto>> UpdateStatusOrderAsync(OrderUpdateStatusDto data)
        {
            var order = await _orderRepository.GetByIdAsync(data.orderID);
            if (order is null)
            {
                throw new Exception(Message.ORDER_NOT_FOUND);
            }
            order.Status = data.status;
            if (order.Status == OrderStatusEnum.Canceled)
            {
                await _technicianWorkingSessionRepository.MakeCancel(order.Id);
                await _technicianWorkingSessionRepository.MakeAvaliable(order.Id);
            }
            if (order.Status == OrderStatusEnum.Processing)
            {
                await _technicianWorkingSessionRepository.MakeProcessing(order.Id);

            }
            await _orderRepository.UpdateAsync(order);
            return new ResponseDto<OrderResponseDto>
            {
                statusCode = 200,
                message = Message.ORDER_STATUS_UPDATED_SUCCESS,
                data = _mapper.Map<OrderResponseDto>(order)
            };
        }
        public async Task<StringBuilder> GetOrderPartViewModelsAsync(int orderId)
        {   
            var orderparts = await _orderPartRepository.GetOrderPartViewModelAsync(orderId);
            var orderPartRows = new StringBuilder();

            foreach (var op in orderparts)
            {
                orderPartRows.Append($@"
                <tr>
                    <td style=""padding:10px; border:1px solid #ddd;"">{op.partID}</td>
                    <td style=""padding:10px; border:1px solid #ddd;"">{op.partName}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{op.quantity}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{op.price:N0}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{op.replacePrice:N0}</td>
                    <td style=""padding:10px; border:1px solid #ddd; text-align:right;"">{(op.quantity * (op.replacePrice + op.price)):N0}</td>
                </tr>");

            }
            return orderPartRows;
        }
        public async Task<int> GetAppointmentIdByOrderIdAsync(int orderId)
        {
            return await _orderRepository.GetAppointmentIdByOrderId(orderId);
        }

        public async Task<OrderViewModel> GetOrderDetailAsync(int orderId)
        {
            return await _orderRepository.GetOrderDetailAsync(orderId);
        }

        public async Task UpdateOrderAsync(OrderUpdateModel model,int employeeId)
        {

            var entity = await _orderRepository.GetByIdAsync(model.Id);
            if (entity == null)
            {

                throw new Exception($"The Order {model.Id} doesn't not exist");
            }
            if (entity.Status == DataAccess.Enums.OrderStatusEnum.Canceled || entity.Status == DataAccess.Enums.OrderStatusEnum.Completed)
            {
                throw new Exception($"The Order {model.Id} haved canceled or completed");

            }

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                var data = await _orderRepository.GetOrderPartsByOrderId(model.Id);
                foreach (var op in data.OrderParts)
                {
                    var part = await _partRepository.GetByIdAsync(op.PartId);
                    if (part == null) throw new Exception($"Part {op.PartId} not found");
                    part.Stock += op.Quantity;
                    _partRepository.Update(part);
                }
                var appointment = await _appointmentRepository.GetByOrderIdAsync(model.Id);
               
                await _orderRepository.RemoveOrderPartsAsync(model.Id);
                foreach (var part in model.OrderParts)
                {
                    var originalPart = await _partRepository.GetByIdAsync(part.PartId);
                    var partName = originalPart != null ? originalPart.Name : part.PartId.ToString();
                    if (originalPart == null) throw new Exception($"Part {partName} not found");
                    if (part.Quantity > originalPart.Stock) throw new Exception($"Part {partName} doesn't have enough stock");
                    originalPart.Stock -= part.Quantity;
                    _partRepository.Update(originalPart);

                    await _orderRepository.AddOrderPartAsync(new OrderPart
                    {
                        OrderId = model.Id,
                        PartId = part.PartId,
                        Quantity = part.Quantity,
                        TechnicianId = part.TechnicianId,
                        Price = originalPart.Price,
                        ReplacementPrice = originalPart.ReplacementPrice
                    });

                  
                }
                var newAppointmentParts = new List<AppointmentPartCondition>();
                
                foreach (var techId in model.OrderParts)
                {
                    var levelEnum = await _appointmentPartConditionRepository.GetAppointmentPartConditionsByTechIdAndOrderIdAsync(appointment.Id,techId.PartId, techId.TechnicianId);
                    newAppointmentParts.Add(new AppointmentPartCondition
                    {
                        AppointmentId = appointment.Id,
                        PartId = techId.PartId,
                        TechicianId = techId.TechnicianId,
                        Level = levelEnum ?? DamageLevelEnum.NotAssessed
                    });
                }
                await _appointmentPartConditionRepository.RemoveByAppointmentIdAsync(appointment.Id);
                foreach (var apc in newAppointmentParts)
                {
                    await _appointmentPartConditionRepository.CreateAppointmentPartConditionAsync(apc);
                }


            });
            var employee = await _accountRepository.GetByIdAsync(employeeId);
            foreach ( var part in model.OrderParts)
            {
                var partName = (await _partRepository.GetByIdAsync(part.PartId)).Name;

                var message = $"Part {partName} (Quantity: {part.Quantity}) in Order {model.Id} has been updated by {employee.First_Name} {employee.Last_Name}";
                await _orderDetailLogService.AddLogByOrderIdAndPartId(model.Id, part.PartId, message);
            }

        }


        public async Task UpdatePartToOrder(OrderPartAddModel model, int technicianId)
        {

            var order = await _technicianWorkingSessionRepository.GetTechnicianWorkingSession(model.OrderId, technicianId);
            if (order == null)
            {
                throw new Exception("Source not found");
            }
            if (order.Status != TechnicianWorkingSessionEnum.AddingPart)
            {
                throw new Exception("You are only updated when in adding part status");
            }
            var appointment = await _appointmentRepository.GetByOrderIdAsync(model.OrderId);
            var partsInAppointment = await _appointmentRepository.GetPartIdsInAppointment(appointment.Id);

            foreach (var part in model.Parts) {
                if (!partsInAppointment.Contains(part.Id)) {
                    var partName = (await _partRepository.GetByIdAsync(part.Id)).Name;
                    throw new Exception($"Part {partName} is not in appointment");
                }
            }

            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {

                var orderParts = await _orderPartRepository.GetOrderPart(model.OrderId, technicianId);
                var partIds = orderParts.Select(x => x.PartId).ToList();
                var partDics = await _partRepository.GetPartWithIDs(partIds);

                foreach (var part in orderParts)
                {

                    if (partDics.ContainsKey(part.PartId)) partDics[part.PartId].Stock += part.Quantity;

                }

                await _orderPartRepository.RemoveRange(model.OrderId, technicianId);
                var existingPartIds = await _orderPartRepository.GetPartByOrderId(model.OrderId);
                foreach (var part in model.Parts)
                {
                    if (existingPartIds.Contains(part.Id))
                    {
                        var partName = (await _partRepository.GetByIdAsync(part.Id)).Name;
                        throw new Exception($"Part {partName} is already in order");
                    }
                }

                await AddOrder(model, technicianId);


            });

            var technician = await _accountRepository.GetAccountByTechId(technicianId);
            foreach (var part in model.Parts)
            {
                var partName = (await _partRepository.GetByIdAsync(part.Id)).Name;
                var message = $"Technician {technician.First_Name} {technician.Last_Name} updated part {partName} (Quantity: {part.Quantity}) to Order {model.OrderId}.";
                await _orderDetailLogService.AddLogByOrderIdAndPartId(model.OrderId, part.Id, message);
            }


        }
        public virtual async Task AddOrder(OrderPartAddModel model, int technicianId)
        {
            var partIds = model.Parts.Select(p => p.Id).Distinct().ToList();
            var partsDict = await _partRepository.GetPartWithIDs(partIds);

            foreach (var req in model.Parts)
            {
                if (!partsDict.TryGetValue(req.Id, out var part))
                    throw new Exception($"Part {req.Id} not found");

                if (req.Quantity > part.Stock)
                    throw new Exception($"The part '{part.Name}' doesn't have enough stock");


            }
            var orderParts = model.Parts.Select(req => new OrderPart
            {
                OrderId = model.OrderId,
                TechnicianId = technicianId,
                PartId = req.Id,
                Quantity = req.Quantity,
                Price = partsDict[req.Id].Price,
                ReplacementPrice = partsDict[req.Id].ReplacementPrice
            }).ToList();
            await _orderPartRepository.AddRange(orderParts);
            foreach (var req in model.Parts)
                partsDict[req.Id].Stock -= req.Quantity;

        }
        public async Task AddPartsToAnOrder(OrderPartAddModel model, int technicianId)
        {
            var order = await _technicianWorkingSessionRepository.GetTechnicianWorkingSession(model.OrderId, technicianId);
            if (order == null)
            {
                throw new Exception("Source not found");
            }
            if (order.Status != TechnicianWorkingSessionEnum.AddingPart)
            {
                throw new Exception("You are only updated when in adding part status");

            }
            var appointment = await _appointmentRepository.GetByOrderIdAsync(model.OrderId);
            var partsInAppointment = await _appointmentRepository.GetPartIdsInAppointment(appointment.Id);
            var existingOrderParts = await _orderPartRepository.GetPartByOrderId(model.OrderId);
            foreach (var part in model.Parts)
            {
                var partName = (await _partRepository.GetByIdAsync(part.Id)).Name;
                if (!partsInAppointment.Contains(part.Id))
                {
                    throw new Exception($"Part {partName} is not in appointment");
                }
                if(existingOrderParts.Contains(part.Id))
                {
                    throw new Exception($"Part {partName} is already in order");
                }
            }

         
            await _unitOfWork.ExecuteInTransactionAsync(async () => {

                await AddOrder(model, technicianId);

            });
            var technician = await _accountRepository.GetAccountByTechId(technicianId);
            foreach (var part in model.Parts)
            {
                var partName = (await _partRepository.GetByIdAsync(part.Id)).Name;
                var message = $"Technician {technician.First_Name} {technician.Last_Name} added part {partName} (Quantity: {part.Quantity}) to Order {model.OrderId}.";
                await _orderDetailLogService.AddLogByOrderIdAndPartId(model.OrderId, part.Id, message);
            }


        }

        public async Task<IEnumerable<OrderPartViewModel>> GetOrdersForTechnicianAsync(int technicianId, int orderId)
        {
            return await _orderPartRepository.GetOrdersForTechnicianAsync(technicianId, orderId);
        }

        public async Task UpdateOrderPartStatusAsync(OrderPartStatusUpdateModel model, int technicianId) {
            var orderPart = await _orderPartRepository.GetOrderPartByOrderIdAndPartId(model.OrderId, model.PartId, technicianId);
            if (orderPart == null) {
                throw new Exception("Order part not found");
            }
            orderPart.IsReplaced = model.IsReplaced;
            await _orderPartRepository.UpdateAsync(orderPart);
            var appointment = await _appointmentRepository.GetByOrderIdAsync(model.OrderId);
            var appoimentPartConditions = await _appointmentPartConditionRepository
                .GetAppointmentPartConditionsByTechIdAndPartIdAndAppointmentIdAsync(appointment.Id, model.PartId, technicianId);
            if (appoimentPartConditions != null) {
                if (model.IsReplaced) {
                    appoimentPartConditions.Level = DamageLevelEnum.Done;
                    await _appointmentPartConditionRepository.UpdateAsync(appoimentPartConditions);
                }
               

            }
            var part =  await _partRepository.GetByIdAsync(model.PartId);
            var technician = await _accountRepository.GetAccountByTechId(technicianId);
            var message = $"Technician {technician.First_Name} {technician.Last_Name} marked part {part.Name} in Order {model.OrderId} is done.";
            await _orderDetailLogService.AddLogByOrderIdAndPartId(model.OrderId, model.PartId, message);
        }

        public async Task UpdateOrderPartTechnicianAsync(OrderPartUpdateTechnicianModel model) {
            await _unitOfWork.ExecuteInTransactionAsync(async () =>
            {
                foreach (var orderPart in model.UpdateParts) {
                    var existingOrderPart = await _orderPartRepository.GetOrderPartByOrderIdAndPartId(model.OrderId, orderPart.PartId, orderPart.OldTechnicianId);
                    await _orderPartRepository.DeleteAsync(model.OrderId, orderPart.PartId, orderPart.OldTechnicianId);
                    var newOrderPart = new OrderPart
                    {
                        OrderId = model.OrderId,
                        PartId = orderPart.PartId,
                        TechnicianId = orderPart.NewTechnicianId,
                        Quantity = existingOrderPart.Quantity,
                        Price = existingOrderPart.Price,
                        ReplacementPrice = existingOrderPart.ReplacementPrice,
                        IsReplaced = existingOrderPart.IsReplaced

                    };
                    await _orderPartRepository.AddRange(new List<OrderPart> { newOrderPart });
                    var appointment = await _appointmentRepository.GetByOrderIdAsync(model.OrderId);
                    var levelEnum = await _appointmentPartConditionRepository
                    .GetAppointmentPartConditionsByTechIdAndOrderIdAsync(appointment.Id, orderPart.PartId, orderPart.OldTechnicianId);
                    await _appointmentPartConditionRepository.DeleteAppointmentPartConditionsByAppointmentIdAndOrderIdAndPartIdAsync(appointment.Id,orderPart.PartId, orderPart.OldTechnicianId);
                    await _appointmentPartConditionRepository.CreateAppointmentPartConditionAsync(new AppointmentPartCondition
                    {
                        AppointmentId = appointment.Id,
                        PartId = orderPart.PartId,
                        TechicianId = orderPart.NewTechnicianId,
                        Level = levelEnum ?? DamageLevelEnum.NotAssessed
                    });

                }
                var listsIdDistinct = model.UpdateParts.Select(x => x.NewTechnicianId).Distinct().ToList();
                foreach (var techId in listsIdDistinct) { 

                    var employee = await _employeeRepository.GetEmployeeByTechnicianId(techId);
                    if (employee.Status == DataAccess.Enums.EmployeeStatusEnum.Available) {
                        employee.Status = DataAccess.Enums.EmployeeStatusEnum.Busy;
                      
                    }


                    await _technicianWorkingSessionRepository.AddTechnician(new TechnicianWorkingSession
                    {
                        OrderId = model.OrderId,
                        TechnicianId = techId,
                        StartTime = DateTime.UtcNow.AddHours(7),
                        Status = TechnicianWorkingSessionEnum.InProgress,
                        EndTime = null
                    });
                }


            });

            foreach (var orderPart in model.UpdateParts) {
                var technician = await _accountRepository.GetAccountByTechId(orderPart.NewTechnicianId);
                var oldTechnician = await _accountRepository.GetAccountByTechId(orderPart.OldTechnicianId);
                var part = await _partRepository.GetByIdAsync(orderPart.PartId);
                var message = $"Part {part.Name} in Order {model.OrderId} reassigned from Technician {oldTechnician.First_Name} {oldTechnician.Last_Name} to Technician {technician.First_Name} {technician.Last_Name}.";
                await _orderDetailLogService.AddLogByOrderIdAndPartId(model.OrderId, orderPart.PartId, message);
            }

        }
    }
}
