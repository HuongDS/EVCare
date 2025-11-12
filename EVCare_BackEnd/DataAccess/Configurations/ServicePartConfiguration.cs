using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configurations {
    public class ServicePartConfiguration : IEntityTypeConfiguration<ServicePart> {
        public void Configure(EntityTypeBuilder<ServicePart> builder) {
            builder.HasKey(sp => new { sp.ServiceId, sp.PartId });
        }
    }
}
