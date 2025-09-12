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
    public class TechnicianConfiguration : IEntityTypeConfiguration<Technician>
    {
        public void Configure(EntityTypeBuilder<Technician> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Employee).WithOne(x => x.Technician).HasForeignKey<Technician>(x => x.EmployeeId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.TechnicianCategory).WithMany(x => x.Technicians).HasForeignKey(x => x.TechnicianCategoryId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
