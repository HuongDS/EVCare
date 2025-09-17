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
    public class TechnicianWorkingSessionConfiguration : IEntityTypeConfiguration<TechnicianWorkingSession>
    {
       

        public void Configure(EntityTypeBuilder<TechnicianWorkingSession> builder)
        {
            builder.HasKey(tws => new { tws.TechnicianId, tws.OrderId });
            builder.Property(x=>x.StartTime).HasDefaultValueSql("GETDATE()").ValueGeneratedOnAdd();

        }
    }
    
    }

