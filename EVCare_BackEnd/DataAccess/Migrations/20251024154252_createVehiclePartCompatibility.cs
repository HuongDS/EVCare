using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class createVehiclePartCompatibility : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Model3DUrl",
                table: "VehiclesCategories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VehiclePartCompatibilities",
                columns: table => new
                {
                    VehicleCategoryId = table.Column<int>(type: "int", nullable: false),
                    PartCategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiclePartCompatibilities", x => new { x.VehicleCategoryId, x.PartCategoryId });
                    table.ForeignKey(
                        name: "FK_VehiclePartCompatibilities_PartCategories_PartCategoryId",
                        column: x => x.PartCategoryId,
                        principalTable: "PartCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VehiclePartCompatibilities_VehiclesCategories_VehicleCategoryId",
                        column: x => x.VehicleCategoryId,
                        principalTable: "VehiclesCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 1,
                column: "Model3DUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 2,
                column: "Model3DUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "VehiclesCategories",
                keyColumn: "Id",
                keyValue: 4,
                column: "Model3DUrl",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_VehiclePartCompatibilities_PartCategoryId",
                table: "VehiclePartCompatibilities",
                column: "PartCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VehiclePartCompatibilities");

            migrationBuilder.DropColumn(
                name: "Model3DUrl",
                table: "VehiclesCategories");
        }
    }
}
