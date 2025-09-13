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
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(r => r.Id);
            builder.HasOne(r=>r.Appointment)
                .WithMany(x=>x.Reviews)
                .HasForeignKey(r=>r.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(r => r.Create_At)
                   .HasDefaultValueSql("GETDATE()")
                   .ValueGeneratedOnAdd();
            builder.Property(r => r.Updated_At)
                   .HasDefaultValueSql("GETDATE()")
                   .ValueGeneratedOnAddOrUpdate();
        }
    }
}
