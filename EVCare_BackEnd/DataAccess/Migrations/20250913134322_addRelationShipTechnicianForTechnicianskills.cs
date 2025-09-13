using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addRelationShipTechnicianForTechnicianskills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ServiceCategoryId",
                table: "TechnicianSkills",
                newName: "TechnicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_TechnicianSkills_Technicians_TechnicianId",
                table: "TechnicianSkills",
                column: "TechnicianId",
                principalTable: "Technicians",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TechnicianSkills_Technicians_TechnicianId",
                table: "TechnicianSkills");

            migrationBuilder.RenameColumn(
                name: "TechnicianId",
                table: "TechnicianSkills",
                newName: "ServiceCategoryId");
        }
    }
}
