using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Invoice;
using DataAccess.Dtos.OrderPart;
using DataAccess.Dtos.OrderParts;
using DataAccess.Dtos.Orders;
using DataAccess.Entities;

namespace Application.Interfaces
{
    public interface IOrderService
    {
        Task AddPartsToAnOrder(OrderPartAddModel model,int technicianId);
        Task<ResponseDto<OrderPartsViewDto>> AddPartsToOrder(List<OrderPartAddDto> data, int orderId);
        Task<ResponseDto<OrderResponseDto>> CreateOrderAsync(OrderCreateRequestDto data);
        Task<int> GetAppointmentIdByOrderIdAsync(int orderId);
        Task<OrderViewModel> GetOrderDetailAsync(int orderId);
        Task<StringBuilder> GetOrderPartViewModelsAsync(int orderId);
        Task<IEnumerable<OrderPartViewModel>> GetOrdersForTechnicianAsync(int technicianId, int orderId);
        Task UpdateOrderAsync(OrderUpdateModel model,int employeeId);
        Task UpdateOrderPartStatusAsync(OrderPartStatusUpdateModel model, int technicianId);
        Task UpdateOrderPartTechnicianAsync(OrderPartUpdateTechnicianModel model);
        Task UpdatePartToOrder(OrderPartAddModel model,int technicianId);
        Task<ResponseDto<OrderResponseDto>> UpdateStatusOrderAsync(OrderUpdateStatusDto data);
    }
}
