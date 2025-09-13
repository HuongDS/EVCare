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
          
            builder.HasData(
                // 🔧 Plumbing
                new Service
                {
                    Id = 1,
                    CategoryId = 1,
                    Name = "Pipe Installation",
                    Description = "Installation of new water and drainage pipes in residential and commercial buildings.",
                    Duration = 2.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 2,
                    CategoryId = 1,
                    Name = "Leak Repair",
                    Description = "Detection and repair of pipe leaks to prevent water damage and reduce waste.",
                    Duration = 1.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // ⚡ Electrical
                new Service
                {
                    Id = 3,
                    CategoryId = 2,
                    Name = "Wiring Installation",
                    Description = "Installation of electrical wiring for new constructions or renovations.",
                    Duration = 3.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 4,
                    CategoryId = 2,
                    Name = "Light Fixture Repair",
                    Description = "Repair and replacement of broken or faulty light fixtures and switches.",
                    Duration = 1.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // ❄ HVAC
                new Service
                {
                    Id = 5,
                    CategoryId = 3,
                    Name = "Air Conditioner Installation",
                    Description = "Installation of new air conditioning units for residential and office spaces.",
                    Duration = 4.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 6,
                    CategoryId = 3,
                    Name = "Heater Maintenance",
                    Description = "Regular inspection and maintenance of heating systems to ensure efficiency.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // 🪵 Carpentry
                new Service
                {
                    Id = 7,
                    CategoryId = 4,
                    Name = "Furniture Repair",
                    Description = "Repair and restoration of wooden furniture such as chairs, tables, and cabinets.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 8,
                    CategoryId = 4,
                    Name = "Door and Window Installation",
                    Description = "Custom installation of wooden doors and windows with fittings.",
                    Duration = 3.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // 🎨 Painting
                new Service
                {
                    Id = 9,
                    CategoryId = 5,
                    Name = "Interior Painting",
                    Description = "Painting of walls, ceilings, and trim inside residential and office buildings.",
                    Duration = 5.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 10,
                    CategoryId = 5,
                    Name = "Exterior Painting",
                    Description = "Weather-resistant painting of exterior walls and structures.",
                    Duration = 6.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // 🧹 Cleaning
                new Service
                {
                    Id = 11,
                    CategoryId = 6,
                    Name = "Deep Cleaning",
                    Description = "Comprehensive cleaning service for kitchens, bathrooms, and high-traffic areas.",
                    Duration = 3.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 12,
                    CategoryId = 6,
                    Name = "Office Cleaning",
                    Description = "Regular cleaning services for office spaces, desks, and meeting rooms.",
                    Duration = 2.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // 🌳 Landscaping
                new Service
                {
                    Id = 13,
                    CategoryId = 7,
                    Name = "Lawn Care",
                    Description = "Mowing, fertilizing, and maintaining healthy lawns and garden areas.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 14,
                    CategoryId = 7,
                    Name = "Tree Trimming",
                    Description = "Safe trimming and pruning of trees and shrubs to maintain landscape design.",
                    Duration = 3.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },

                // 🔧 Appliance Repair
                new Service
                {
                    Id = 15,
                    CategoryId = 8,
                    Name = "Refrigerator Repair",
                    Description = "Troubleshooting and repairing cooling system issues in refrigerators.",
                    Duration = 2.5m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                },
                new Service
                {
                    Id = 16,
                    CategoryId = 8,
                    Name = "Washing Machine Repair",
                    Description = "Repair and maintenance of washing machines including drum and motor issues.",
                    Duration = 2.0m,
                    Create_At = new DateTime(2025, 01, 01),
                    Updated_At = new DateTime(2025, 01, 01),
                    Deleted_At = DateTime.MinValue
                }
            );
        }
    }
}
