using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateAppointmentPartConditonTabel1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentPartConditions_Technicians_TechnicianId",
                table: "AppointmentPartConditions");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentPartConditions_TechnicianId",
                table: "AppointmentPartConditions");

            migrationBuilder.DropColumn(
                name: "TechnicianId",
                table: "AppointmentPartConditions");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPartConditions_TechicianId",
                table: "AppointmentPartConditions",
                column: "TechicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentPartConditions_Technicians_TechicianId",
                table: "AppointmentPartConditions",
                column: "TechicianId",
                principalTable: "Technicians",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppointmentPartConditions_Technicians_TechicianId",
                table: "AppointmentPartConditions");

            migrationBuilder.DropIndex(
                name: "IX_AppointmentPartConditions_TechicianId",
                table: "AppointmentPartConditions");

            migrationBuilder.AddColumn<int>(
                name: "TechnicianId",
                table: "AppointmentPartConditions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentPartConditions_TechnicianId",
                table: "AppointmentPartConditions",
                column: "TechnicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppointmentPartConditions_Technicians_TechnicianId",
                table: "AppointmentPartConditions",
                column: "TechnicianId",
                principalTable: "Technicians",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
