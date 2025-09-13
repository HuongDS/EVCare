using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addKeyForTechnicianSkilss : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills",
                columns: new[] { "TechnicianId", "TechnicianCategoryId", "ServiceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills",
                columns: new[] { "TechnicianId", "TechnicianCategoryId" });
        }
    }
}
