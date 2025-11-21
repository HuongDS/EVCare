using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configuration
{
    public class AcccountConfigutation : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Email).IsRequired().HasMaxLength(100);
            builder.Property(x => x.First_Name).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Last_Name).IsRequired().HasMaxLength(50);
            builder.Property(x => x.Phone).IsRequired(false).HasMaxLength(11);
            builder.Property(x => x.Create_At).HasDefaultValueSql("GETDATE()");
            builder.Property(x => x.Updated_At).HasDefaultValueSql("GETDATE()");
            builder.HasIndex(x => x.Email).IsUnique();
            builder.HasIndex(x => x.Phone).IsUnique();

            //builder.HasOne(a=>a.Employee)
            //       .WithOne(e=>e.Account)
            //       .HasForeignKey<Employee>(e=>e.AccountId)
            //       .OnDelete(DeleteBehavior.Cascade);
            builder.HasIndex(x => new { x.First_Name, x.Last_Name });


            builder.HasData(
               new Account
               {
                   Id = 1,
                   Role = RoleEnum.Admin,
                   Email = "admin@example.com",
                   First_Name = "System",
                   Last_Name = "Admin",
                   Phone = "0900000001",
                   Hash_Password = "$2a$11$abcdefghijkLmnopqrstuVWxyz1234567890ABCDEFGHijklm",
                   Create_At = new DateTime(2025, 01, 01),
                   Updated_At = new DateTime(2025, 01, 01),
                   Deleted_At = DateTime.MinValue
               },
               new Account
               {
                   Id = 2,
                   Role = RoleEnum.Staff,
                   Email = "staff@example.com",
                   First_Name = "John",
                   Last_Name = "Doe",
                   Phone = "0900000002",
                   Hash_Password = "$2a$11$abcdefghijkLmnopqrstuVWxyz1234567890ABCDEFGHijklm",
                   Create_At = new DateTime(2025, 01, 01),
                   Updated_At = new DateTime(2025, 01, 01),
                   Deleted_At = DateTime.MinValue
               },
               new Account
               {
                   Id = 3,
                   Role = RoleEnum.Customer,
                   Email = "customer@example.com",
                   First_Name = "Jane",
                   Last_Name = "Smith",
                   Phone = "0900000003",
                   Hash_Password = "$2a$11$abcdefghijkLmnopqrstuVWxyz1234567890ABCDEFGHijklm",
                   Create_At = new DateTime(2025, 01, 01),
                   Updated_At = new DateTime(2025, 01, 01),
                   Deleted_At = DateTime.MinValue
               },
               new Account
               {
                   Id = 4,
                   Role = RoleEnum.Technician,
                   Email = "technician@example.com",
                   First_Name = "John",
                   Last_Name = "Smith",
                   Phone = "0900000004",
                   Hash_Password = "$2a$11$abcdefghijkLmnopqrstuVWxyz1234567890ABCDEFGHijklm",
                   Create_At = new DateTime(2025, 01, 01),
                   Updated_At = new DateTime(2025, 01, 01),
                   Deleted_At = DateTime.MinValue
               }
           );
        }
    }
}
