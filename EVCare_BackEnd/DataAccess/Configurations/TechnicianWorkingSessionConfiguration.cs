using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configuration
{
    public class TechnicianWorkingSessionConfiguration : IEntityTypeConfiguration<TechnicianWorkingSession>
    {
       

        public void Configure(EntityTypeBuilder<TechnicianWorkingSession> builder)
        {
            builder.HasKey(tws => new { tws.TechnicianId, tws.OrderId });
            builder.Property(x => x.StartTime).HasDefaultValueSql("GETDATE()").ValueGeneratedOnAdd();
            builder.HasIndex(tws=>new { tws.TechnicianId, tws.Status })
                   .HasDatabaseName("IX_TechnicianWorkingSessions_TechnicianId_Status");
            builder.HasIndex(tws => tws.OrderId)
                   .HasDatabaseName("IX_TechnicianWorkingSessions_OrderId");

        }
    }
    
    }

