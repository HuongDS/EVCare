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
    public class TechnicianSkillConfigruation : IEntityTypeConfiguration<TechnicianSkill>
    {
        public void Configure(EntityTypeBuilder<TechnicianSkill> builder)
        {
            builder.HasKey(x => new { x.ServiceCategoryId, x.TechnicianCategoryId });
            builder.HasOne(ts => ts.ServiceCategories)
                   .WithMany(sc => sc.TechnicianSkills)
                   .HasForeignKey(ts => ts.ServiceCategoryId)
                   .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(ts => ts.TechnicianCategories).WithMany(tc => tc.TechnicianSkills)
                   .HasForeignKey(ts => ts.TechnicianCategoryId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
