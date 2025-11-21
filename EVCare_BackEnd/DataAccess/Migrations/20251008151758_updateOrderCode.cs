using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateOrderCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "OrderCode",
                table: "Invoices",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_OrderCode",
                table: "Invoices",
                column: "OrderCode",
                unique: true,
                filter: "[OrderCode] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Invoices_OrderCode",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "OrderCode",
                table: "Invoices");
        }
    }
}
