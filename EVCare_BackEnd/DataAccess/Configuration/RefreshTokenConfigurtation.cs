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
    public class RefreshTokenConfigurtation : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x=>x.Account).WithMany(x=>x.RefreshTokens).HasForeignKey(x=>x.AccountId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
