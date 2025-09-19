using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DataAccess;
using DataAccess.Dtos.OrderParts;
using DataAccess.Entities;

namespace Application.Resolver
{
    public class PartPriceResolver : IValueResolver<OrderPartAddDto, OrderPart, decimal>
    {
        private readonly EVCareDbContext _context;
        public PartPriceResolver(EVCareDbContext context)
        {
            _context = context;
        }
        public decimal Resolve(OrderPartAddDto source, OrderPart destination, decimal destMember, ResolutionContext context)
        {
            var part = _context.Parts.FirstOrDefault(p => p.Id == source.partID);
            if (part == null)
            {
                throw new Exception($"Part with id = {source.partID} not found");
            }
            return part.Price;
        }
    }
}
