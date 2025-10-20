using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(o => o.Id);
            builder.HasOne(o=>o.Appointment)
                .WithOne(a=>a.Order)
                .HasForeignKey<Order>(o=>o.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(x => x.AppointmentId)
                  .HasDatabaseName("IX_Orders_AppointmentId");
            
        }
    }
}
