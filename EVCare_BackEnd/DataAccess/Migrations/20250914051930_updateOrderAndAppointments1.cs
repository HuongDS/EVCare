using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateOrderAndAppointments1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orders_AppointmentId",
                table: "Orders");

            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "Appointments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_AppointmentId",
                table: "Orders",
                column: "AppointmentId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orders_AppointmentId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_AppointmentId",
                table: "Orders",
                column: "AppointmentId");
        }
    }
}
