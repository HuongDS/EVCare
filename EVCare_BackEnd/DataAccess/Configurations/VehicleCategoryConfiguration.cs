
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
    public class VehicleCategoryConfiguration : IEntityTypeConfiguration<VehiclesCategory>
    {
        public void Configure(EntityTypeBuilder<VehiclesCategory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(50);
            builder.Property(x => x.ScaleX).HasPrecision(18, 7);
            builder.Property(x => x.ScaleY).HasPrecision(18, 7);
            builder.Property(x => x.ScaleZ).HasPrecision(18, 7);
            builder.HasData(
                new VehiclesCategory { Id = 1, Name = "Sedan" },
                new VehiclesCategory { Id = 2, Name = "SUV" },
                new VehiclesCategory { Id = 4, Name = "Coupe" }
            );
        }
    }
}
