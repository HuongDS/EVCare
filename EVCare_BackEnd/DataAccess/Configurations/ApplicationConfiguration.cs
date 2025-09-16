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
    public class ApplicationConfiguration : IEntityTypeConfiguration<DataAccess.Entities.Application>
    {
        public void Configure(EntityTypeBuilder<DataAccess.Entities.Application> builder)
        {
            builder.HasKey(a => a.Id);
            builder.HasOne(a => a.Employee)
                   .WithMany(c => c.Applications)
                   .HasForeignKey(a => a.EmployeeId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
