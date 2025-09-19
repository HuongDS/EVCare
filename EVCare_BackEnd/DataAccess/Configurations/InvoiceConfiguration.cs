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
    public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
    {
        public void Configure(EntityTypeBuilder<Invoice> builder)
        {
            builder.HasKey(i => i.Id);
            builder.HasOne(i => i.Customer)
                   .WithMany(a => a.Invoices)
                   .HasForeignKey(i => i.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(i => i.Order)
                .WithOne(Order => Order.Invoice)
                .HasForeignKey<Invoice>(i => i.OrderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
