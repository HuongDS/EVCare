using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateTechnicianCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TechnicianSkills_TechnicianCategories_TechnicianCategoryId",
                table: "TechnicianSkills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills");

            migrationBuilder.DropIndex(
                name: "IX_TechnicianSkills_TechnicianCategoryId",
                table: "TechnicianSkills");

            migrationBuilder.DropColumn(
                name: "TechnicianCategoryId",
                table: "TechnicianSkills");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills",
                columns: new[] { "TechnicianId", "ServiceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills");

            migrationBuilder.AddColumn<int>(
                name: "TechnicianCategoryId",
                table: "TechnicianSkills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianSkills",
                table: "TechnicianSkills",
                columns: new[] { "TechnicianId", "TechnicianCategoryId", "ServiceId" });

            migrationBuilder.CreateIndex(
                name: "IX_TechnicianSkills_TechnicianCategoryId",
                table: "TechnicianSkills",
                column: "TechnicianCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_TechnicianSkills_TechnicianCategories_TechnicianCategoryId",
                table: "TechnicianSkills",
                column: "TechnicianCategoryId",
                principalTable: "TechnicianCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
