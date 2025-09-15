using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Configuration
{
    public class TechnicianCategoryConfiguration : IEntityTypeConfiguration<TechnicianCategory>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<TechnicianCategory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(50);
            builder.HasData(
             new TechnicianCategory
             {
                 Id = 1,
                 Name = "Engine Specialist",
                 Description = "Responsible for diagnosing, repairing, and maintaining vehicle engines, including fuel systems, cooling systems, and performance optimization."
             },
new TechnicianCategory
{
    Id = 2,
    Name = "Transmission Specialist",
    Description = "Focuses on manual and automatic transmissions, clutches, gear systems, and drivetrains to ensure smooth power delivery."
},
new TechnicianCategory
{
    Id = 3,
    Name = "Brake Specialist",
    Description = "Handles inspection, repair, and replacement of braking systems, including pads, rotors, calipers, and hydraulic lines."
},
new TechnicianCategory
{
    Id = 4,
    Name = "Electrical Systems Specialist",
    Description = "Works on vehicle electrical components such as wiring, batteries, alternators, lighting, sensors, and onboard electronics."
},
new TechnicianCategory
{
    Id = 5,
    Name = "Suspension and Steering Specialist",
    Description = "Maintains and repairs suspension systems, steering components, and alignment to ensure vehicle stability and handling."
}
            );
        }
    }

}

