using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Dtos;
using DataAccess.Dtos.Orders;

namespace Application.Interfaces
{
    public interface IOrderService
    {
        Task<ResponseDto<OrderResponseDto>> CreateOrderAsync(OrderCreateRequestDto data);
    }
}
