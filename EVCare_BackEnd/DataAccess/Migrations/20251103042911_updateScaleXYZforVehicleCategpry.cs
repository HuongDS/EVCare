using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateScaleXYZforVehicleCategpry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ScaleX",
                table: "VehiclesCategories",
                type: "decimal(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ScaleY",
                table: "VehiclesCategories",
                type: "decimal(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ScaleZ",
                table: "VehiclesCategories",
                type: "decimal(18,6)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "ScaleX", "ScaleY", "ScaleZ" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ScaleX", "ScaleY", "ScaleZ" },
                values: new object[] { null, null, null });

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "ScaleX", "ScaleY", "ScaleZ" },
                values: new object[] { null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScaleX",
                table: "VehiclesCategories");

            migrationBuilder.DropColumn(
                name: "ScaleY",
                table: "VehiclesCategories");

            migrationBuilder.DropColumn(
                name: "ScaleZ",
                table: "VehiclesCategories");
        }
    }
}
