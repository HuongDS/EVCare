using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class removeRelationShipTechnician : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Technicians_TechnicianCategories_TechnicianCategoryId",
                table: "Technicians");

            migrationBuilder.DropIndex(
                name: "IX_Technicians_TechnicianCategoryId",
                table: "Technicians");

            migrationBuilder.DropColumn(
                name: "TechnicianCategoryId",
                table: "Technicians");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TechnicianCategoryId",
                table: "Technicians",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Technicians_TechnicianCategoryId",
                table: "Technicians",
                column: "TechnicianCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Technicians_TechnicianCategories_TechnicianCategoryId",
                table: "Technicians",
                column: "TechnicianCategoryId",
                principalTable: "TechnicianCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
