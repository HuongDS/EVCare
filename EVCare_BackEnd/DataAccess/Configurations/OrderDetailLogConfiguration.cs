using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations {
    public class OrderDetailLogConfiguration : IEntityTypeConfiguration<OrderDetailLog> {
        public void Configure(EntityTypeBuilder<OrderDetailLog> builder) {
            builder.HasKey(odl => odl.Id);
            builder.HasOne(odl => odl.Order)
                   .WithMany(o => o.OrderDetailLogs)
                   .HasForeignKey(odl => odl.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(odl=>odl.Part)
                   .WithMany(p=>p.OrderDetailLogs)
                   .HasForeignKey(odl=>odl.PartId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
