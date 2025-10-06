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
    public class ServiceConfiguration : IEntityTypeConfiguration<Service>
    {
        public void Configure(EntityTypeBuilder<Service> builder)
        {
            builder.HasKey(s => s.Id);
            builder.Property(x=>x.Price).HasPrecision(18, 2);
            builder.HasData(
                // 🔧 Plumbing
                new Service
                {
                    Id = 11,
                   
                    Name = "Pipe Installation",
                    Description = "Installation of new water and drainage pipes in residential and commercial buildings.",
                    Duration = 2.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },
                new Service
                {
                    Id = 12,
                   
                    Name = "Leak Repair",
                    Description = "Detection and repair of pipe leaks to prevent water damage and reduce waste.",
                    Duration = 1.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 400
                },

                // ⚡ Electrical
                new Service
                {
                    Id =13,
                
                    Name = "Wiring Installation",
                    Description = "Installation of electrical wiring for new constructions or renovations.",
                    Duration = 3.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },
                new Service
                {
                    Id = 14,
                    
                    Name = "Light Fixture Repair",
                    Description = "Repair and replacement of broken or faulty light fixtures and switches.",
                    Duration = 1.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 200
                },

                // ❄ HVAC
                new Service
                {
                    Id = 15,
                    
                    Name = "Air Conditioner Installation",
                    Description = "Installation of new air conditioning units for residential and office spaces.",
                    Duration = 4.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },
                new Service
                {
                    Id = 16,
                  
                    Name = "Heater Maintenance",
                    Description = "Regular inspection and maintenance of heating systems to ensure efficiency.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },

           
                new Service
                {
                    Id = 17,
                  
                    Name = "Furniture Repair",
                    Description = "Repair and restoration of wooden furniture such as chairs, tables, and cabinets.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },
                new Service
                {
                    Id = 18,
                    
                    Name = "Door and Window Installation",
                    Description = "Custom installation of wooden doors and windows with fittings.",
                    Duration = 3.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },

                // 🎨 Painting
                new Service
                {
                    Id = 19,
                    
                    Name = "Interior Painting",
                    Description = "Painting of walls, ceilings, and trim inside residential and office buildings.",
                    Duration = 5.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 300
                },
                new Service
                {
                    Id = 20,
                    
                    Name = "Exterior Painting",
                    Description = "Weather-resistant painting of exterior walls and structures.",
                    Duration = 6.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue,
                    Price = 100
                }

            );
        }
    }
}
