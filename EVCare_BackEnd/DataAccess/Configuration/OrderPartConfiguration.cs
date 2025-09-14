using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configuration
{
    public class OrderPartConfiguration : IEntityTypeConfiguration<OrderPart>
    {
        public void Configure(EntityTypeBuilder<OrderPart> builder)
        {
            builder.HasKey(op => new { op.OrderId, op.PartId,op.TechnicianId });
        }

        
    }
    
    
}
