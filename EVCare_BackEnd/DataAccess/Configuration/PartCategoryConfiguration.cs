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
    public class PartCategoryConfiguration : IEntityTypeConfiguration<PartCategory>
    {
        public void Configure(EntityTypeBuilder<PartCategory> builder)
        {
            builder.HasKey(pc => pc.Id);
            builder.HasMany(pc => pc.Parts)
                   .WithOne(p => p.Category)
                   .HasForeignKey(p => p.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);


            builder.HasData(
                    new PartCategory
                    {
                        Id = 1,
                        Name = "Engine Components",
                        Description = "Parts related to the vehicle engine such as pistons, spark plugs, and gaskets.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 2,
                        Name = "Brake System",
                        Description = "Brake pads, rotors, calipers, and other braking components.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 3,
                        Name = "Electrical Parts",
                        Description = "Batteries, alternators, starters, wiring harnesses, and lighting systems.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 4,
                        Name = "Suspension and Steering",
                        Description = "Shock absorbers, struts, tie rods, ball joints, and other suspension/steering parts.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 5,
                        Name = "Tires and Wheels",
                        Description = "Tires, rims, and wheel accessories for various vehicle types.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 6,
                        Name = "Cooling System",
                        Description = "Radiators, water pumps, thermostats, and cooling fans.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new PartCategory
                    {
                        Id = 7,
                        Name = "Exhaust System",
                        Description = "Exhaust pipes, mufflers, catalytic converters, and emission control parts.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    }
                );
        }
    }
}
