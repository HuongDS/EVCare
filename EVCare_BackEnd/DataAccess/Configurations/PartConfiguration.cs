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
    public class PartConfiguration : IEntityTypeConfiguration<Part>
    {
        public void Configure(EntityTypeBuilder<Part> builder)
        {
            builder.HasKey(p => p.Id);  
            builder.HasOne(p => p.Category)
                   .WithMany(pc => pc.Parts)
                   .HasForeignKey(p => p.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(
    // 🔧 Engine Components
    new Part
    {
        Id = 1,
        CategoryId = 1,
        Name = "Piston",
        Description = "Engine piston used to transfer force from combustion to the crankshaft.",
        Price = 1200000m,
        Stock = 50,
        Image = "images/parts/piston.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 2,
        CategoryId = 1,
        Name = "Spark Plug",
        Description = "Ignites the fuel-air mixture in the engine cylinder.",
        Price = 150000m,
        Stock = 200,
        Image = "images/parts/sparkplug.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // 🛑 Brake System
    new Part
    {
        Id = 3,
        CategoryId = 2,
        Name = "Brake Pad",
        Description = "Friction material pressed against the rotor to slow down the vehicle.",
        Price = 800000m,
        Stock = 120,
        Image = "images/parts/brakepad.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 4,
        CategoryId = 2,
        Name = "Brake Rotor",
        Description = "Metal disc that rotates with the wheel and works with brake pads to stop the car.",
        Price = 2500000m,
        Stock = 60,
        Image = "images/parts/brakerotor.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // ⚡ Electrical Parts
    new Part
    {
        Id = 5,
        CategoryId = 3,
        Name = "Car Battery",
        Description = "Provides electrical energy to start the engine and power accessories.",
        Price = 3500000m,
        Stock = 40,
        Image = "images/parts/battery.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 6,
        CategoryId = 3,
        Name = "Alternator",
        Description = "Charges the battery and powers the vehicle’s electrical system when running.",
        Price = 4200000m,
        Stock = 30,
        Image = "images/parts/alternator.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // 🚗 Suspension and Steering
    new Part
    {
        Id = 7,
        CategoryId = 4,
        Name = "Shock Absorber",
        Description = "Absorbs and dampens shock impulses for a smoother ride.",
        Price = 1800000m,
        Stock = 70,
        Image = "images/parts/shockabsorber.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 8,
        CategoryId = 4,
        Name = "Tie Rod",
        Description = "Connects steering gear to the steering knuckle, allowing control of the wheels.",
        Price = 950000m,
        Stock = 90,
        Image = "images/parts/tierod.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // 🛞 Tires and Wheels
    new Part
    {
        Id = 9,
        CategoryId = 5,
        Name = "All-Season Tire",
        Description = "Durable tire suitable for use in a wide range of weather conditions.",
        Price = 2200000m,
        Stock = 100,
        Image = "images/parts/tire.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 10,
        CategoryId = 5,
        Name = "Alloy Wheel",
        Description = "Lightweight wheel made from aluminum alloys, improving performance and style.",
        Price = 2800000m,
        Stock = 50,
        Image = "images/parts/alloywheel.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // ❄ Cooling System
    new Part
    {
        Id = 11,
        CategoryId = 6,
        Name = "Radiator",
        Description = "Exchanges heat from coolant to the outside air to prevent overheating.",
        Price = 3100000m,
        Stock = 35,
        Image = "images/parts/radiator.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 12,
        CategoryId = 6,
        Name = "Water Pump",
        Description = "Circulates coolant through the engine and radiator.",
        Price = 1450000m,
        Stock = 80,
        Image = "images/parts/waterpump.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },

    // 🌫 Exhaust System
    new Part
    {
        Id = 13,
        CategoryId = 7,
        Name = "Muffler",
        Description = "Reduces the noise emitted by the exhaust of an internal combustion engine.",
        Price = 2100000m,
        Stock = 45,
        Image = "images/parts/muffler.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    },
    new Part
    {
        Id = 14,
        CategoryId = 7,
        Name = "Catalytic Converter",
        Description = "Reduces harmful emissions by converting exhaust gases into less harmful substances.",
        Price = 5200000m,
        Stock = 25,
        Image = "images/parts/catalyticconverter.jpg",
        Create_At = new DateTime(2025, 01, 01),
        Updated_At = new DateTime(2025, 01, 01),
        Deleted_At = DateTime.MinValue
    }
);

        }
    }
}
