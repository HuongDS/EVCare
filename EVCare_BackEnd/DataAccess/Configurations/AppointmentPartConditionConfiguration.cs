using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations {
    public class AppointmentPartConditionConfiguration : IEntityTypeConfiguration<AppointmentPartCondition> {
        public void Configure(EntityTypeBuilder<AppointmentPartCondition> builder) {
            builder.HasKey(apc => new {apc.PartId,apc.AppointmentId,apc.TechicianId});
            builder.HasOne(apc => apc.Appointment)
                   .WithMany(a => a.AppointmentPartConditions)
                   .HasForeignKey(apc => apc.AppointmentId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(apc => apc.Part).WithMany(p => p.AppointmentPartConditions)
                   .HasForeignKey(apc => apc.PartId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(apc => apc.Technician).WithMany(t => t.AppointmentPartConditions)
                   .HasForeignKey(apc => apc.TechicianId)
                   .OnDelete(DeleteBehavior.Cascade);


        }
    }
}
