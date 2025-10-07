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
    public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Account)
                .WithOne(x => x.Customer)
                .HasForeignKey<Customer>(x => x.AccountId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(
                new Customer
                {
                    Id = 1,
                    AccountId = 3,
                    Address = "123 Main St, Anytown, USA",
                    Rank = Enums.CustomerRankEnum.MEMBER
                }
                );


        }
    }
}
