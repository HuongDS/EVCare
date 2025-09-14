using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateTechnicianAndOrderPart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderParts",
                table: "OrderParts");

            migrationBuilder.AddColumn<int>(
                name: "TechnicianId",
                table: "OrderParts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderParts",
                table: "OrderParts",
                columns: new[] { "OrderId", "PartId", "TechnicianId" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderParts_TechnicianId",
                table: "OrderParts",
                column: "TechnicianId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderParts_Technicians_TechnicianId",
                table: "OrderParts",
                column: "TechnicianId",
                principalTable: "Technicians",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderParts_Technicians_TechnicianId",
                table: "OrderParts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderParts",
                table: "OrderParts");

            migrationBuilder.DropIndex(
                name: "IX_OrderParts_TechnicianId",
                table: "OrderParts");

            migrationBuilder.DropColumn(
                name: "TechnicianId",
                table: "OrderParts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderParts",
                table: "OrderParts",
                columns: new[] { "OrderId", "PartId" });
        }
    }
}
