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
    public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
    {
        public void Configure(EntityTypeBuilder<Employee> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Account)
                  .WithOne(x => x.Employee)
                  .HasForeignKey<Employee>(x => x.AccountId)
                  .OnDelete(DeleteBehavior.Cascade);
            builder.Property(x => x.CCCD).IsRequired();
            builder.HasIndex(x => x.CCCD).IsUnique();

            builder.HasData(new Employee
            {
                Id = 1,
                AccountId = 1,
                CCCD = "079123456789",
                Updated_At = new DateTime(2025, 01, 10),
                Deleted_At = DateTime.MinValue
            }, new Employee
            {
                Id = 2,
                AccountId = 2,
                CCCD = "079987654321",
                Updated_At = new DateTime(2025, 02, 05),
                Deleted_At = DateTime.MinValue
            },
            new Employee
            {
                Id = 3,
                AccountId = 4,
                CCCD = "079555666777",
                Updated_At = new DateTime(2025, 03, 01),
                Deleted_At = DateTime.MinValue
            });


        }
    }
}
