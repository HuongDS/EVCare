using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations {
    public class VehiclePartCompatibilityConfiguration : IEntityTypeConfiguration<VehiclePartCompatibility> {
        public void Configure(EntityTypeBuilder<VehiclePartCompatibility> builder) {
            builder.HasKey(vpc => new { vpc.VehicleCategoryId, vpc.PartCategoryId });
            builder.HasOne(vpc => vpc.Vehicle)
                   .WithMany(vc => vc.VehiclePartCompatibilities)
                   .HasForeignKey(vpc => vpc.VehicleCategoryId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(vpc => vpc.PartCategory).WithMany(pc => pc.VehiclePartCompatibilities)
                   .HasForeignKey(vpc => vpc.PartCategoryId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
