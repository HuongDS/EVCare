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
    public class AppointmentImageConfiguration : IEntityTypeConfiguration<Appointmentimage>
    {
        public void Configure(EntityTypeBuilder<Appointmentimage> builder)
        {
            builder.HasKey(ai => ai.Id);    
            builder.HasOne(ai => ai.Appointment)
                   .WithMany(a => a.AppointmentImages)
                   .HasForeignKey(ai => ai.AppointmentId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
