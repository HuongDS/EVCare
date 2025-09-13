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
    public class ReviewEmployeeConfiguration : IEntityTypeConfiguration<ReviewEmployee>
    {
        public void Configure(EntityTypeBuilder<ReviewEmployee> builder)
        {
            builder.HasKey(re => new {re.ReviewId,re.EmployeeId});
            builder.Property(re=>re.Create_At).HasDefaultValueSql("GETDATE()").ValueGeneratedOnAdd();
        }
    }
}
