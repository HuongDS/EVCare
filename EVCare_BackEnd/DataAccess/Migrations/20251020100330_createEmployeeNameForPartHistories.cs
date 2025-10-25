using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class createEmployeeNameForPartHistories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "PartHistories");

            migrationBuilder.AddColumn<string>(
                name: "EmployeeName",
                table: "PartHistories",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeName",
                table: "PartHistories");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "PartHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
