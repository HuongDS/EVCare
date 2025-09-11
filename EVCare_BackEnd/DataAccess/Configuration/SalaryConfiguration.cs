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
    public class SalaryConfiguration : IEntityTypeConfiguration<Salary>
    {
        public void Configure(EntityTypeBuilder<Salary> builder)
        {
            builder.HasKey(s => s.Id);
            builder.HasOne(s => s.Employee)
                   .WithMany(e => e.Salaries)
                   .HasForeignKey(s => s.EmployeeId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
