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
    public class ServiceCategoryConfiguration : IEntityTypeConfiguration<ServiceCategory>
    {
        public void Configure(EntityTypeBuilder<ServiceCategory> builder)
        {
            builder.HasKey(sc => sc.Id);
            builder.HasData(
                    new ServiceCategory
                    {
                        Id = 1,
                        Name = "Plumbing",
                        Description = "All plumbing related services including installation, repair, and maintenance of pipes, fixtures, and fittings.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 2,
                        Name = "Electrical",
                        Description = "Installation and repair of electrical wiring, outlets, switches, lighting systems, and power distribution.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 3,
                        Name = "HVAC",
                        Description = "Heating, ventilation, and air conditioning services including installation, maintenance, and repair.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 4,
                        Name = "Carpentry",
                        Description = "Woodwork, furniture repair, installation of doors, windows, cabinets, and other carpentry services.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 5,
                        Name = "Painting",
                        Description = "Interior and exterior painting, wall treatments, and surface preparation for residential and commercial spaces.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 6,
                        Name = "Cleaning",
                        Description = "Residential, office, and industrial cleaning services including deep cleaning and regular maintenance.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 7,
                        Name = "Landscaping",
                        Description = "Garden design, lawn care, tree trimming, and outdoor space maintenance services.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    },
                    new ServiceCategory
                    {
                        Id = 8,
                        Name = "Appliance Repair",
                        Description = "Installation and repair of household appliances including refrigerators, washing machines, ovens, and dishwashers.",
                        Create_At = new DateTime(2025, 01, 01),
                        Updated_At = new DateTime(2025, 01, 01),
                        Deleted_At = DateTime.MinValue
                    }
                );
        }
    }
}
