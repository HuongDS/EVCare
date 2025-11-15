using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateIdForTechnicianWorkingSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianWorkingSessions",
                table: "TechnicianWorkingSessions");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "TechnicianWorkingSessions",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianWorkingSessions",
                table: "TechnicianWorkingSessions",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TechnicianWorkingSessions",
                table: "TechnicianWorkingSessions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TechnicianWorkingSessions");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TechnicianWorkingSessions",
                table: "TechnicianWorkingSessions",
                columns: new[] { "TechnicianId", "OrderId" });
        }
    }
}
