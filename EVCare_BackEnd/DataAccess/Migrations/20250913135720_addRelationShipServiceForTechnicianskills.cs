using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class addRelationShipServiceForTechnicianskills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "TechnicianSkills",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TechnicianSkills_ServiceId",
                table: "TechnicianSkills",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_TechnicianSkills_Services_ServiceId",
                table: "TechnicianSkills",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TechnicianSkills_Services_ServiceId",
                table: "TechnicianSkills");

            migrationBuilder.DropIndex(
                name: "IX_TechnicianSkills_ServiceId",
                table: "TechnicianSkills");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "TechnicianSkills");
        }
    }
}
