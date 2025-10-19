using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations {
    public class PartHistoryConfiguration : IEntityTypeConfiguration<PartHistory> {
        public void Configure(EntityTypeBuilder<PartHistory> builder) {
           builder.HasKey(ph => ph.Id);
           builder.HasOne(ph => ph.Part)
                    .WithMany(p => p.PartHistories)
                    .HasForeignKey(ph => ph.PartId)
                    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
