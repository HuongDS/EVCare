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
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
      public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.HasOne(a => a.Customer)
                   .WithMany(c => c.Appointments)
                   .HasForeignKey(a => a.CustomerId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(a => a.Vehicle)
                   .WithMany(v => v.Appointments)
                   .HasForeignKey(a => a.VehicleId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.Property(a => a.Create_At)
                   .HasDefaultValueSql("GETDATE()")
                   .ValueGeneratedOnAdd();
            builder.HasOne(a => a.Employee)
                    .WithMany(e => e.Appointments)
                    .HasForeignKey(a => a.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

        }

    
    }
}
