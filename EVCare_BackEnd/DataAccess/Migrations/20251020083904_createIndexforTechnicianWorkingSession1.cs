using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class createIndexforTechnicianWorkingSession1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Appointments_OrderId_AppointmentDate",
                table: "Appointments",
                columns: new[] { "OrderId", "Appointment_Date" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_OrderId_AppointmentDate",
                table: "Appointments");
        }
    }
}
