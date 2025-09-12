using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CreateTechnicianAndTechinicianCategoriesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Account_AccountId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Account_AccountId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Account_AccountId",
                table: "RefreshTokens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Account",
                table: "Account");

            migrationBuilder.RenameTable(
                name: "Account",
                newName: "Accounts");

            migrationBuilder.RenameIndex(
                name: "IX_Account_Phone",
                table: "Accounts",
                newName: "IX_Accounts_Phone");

            migrationBuilder.RenameIndex(
                name: "IX_Account_Email",
                table: "Accounts",
                newName: "IX_Accounts_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Accounts",
                table: "Accounts",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "TechnicianCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Deleted_At = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnicianCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Technicians",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    TechnicianCategoryId = table.Column<int>(type: "int", nullable: false),
                    Created_At = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Technicians", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Technicians_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Technicians_TechnicianCategories_TechnicianCategoryId",
                        column: x => x.TechnicianCategoryId,
                        principalTable: "TechnicianCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "TechnicianCategories",
                columns: new[] { "Id", "Deleted_At", "Description", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Responsible for diagnosing, repairing, and maintaining vehicle engines, including fuel systems, cooling systems, and performance optimization.", "Engine Specialist" },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Focuses on manual and automatic transmissions, clutches, gear systems, and drivetrains to ensure smooth power delivery.", "Transmission Specialist" },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Handles inspection, repair, and replacement of braking systems, including pads, rotors, calipers, and hydraulic lines.", "Brake Specialist" },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Works on vehicle electrical components such as wiring, batteries, alternators, lighting, sensors, and onboard electronics.", "Electrical Systems Specialist" },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Maintains and repairs suspension systems, steering components, and alignment to ensure vehicle stability and handling.", "Suspension and Steering Specialist" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Technicians_EmployeeId",
                table: "Technicians",
                column: "EmployeeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Technicians_TechnicianCategoryId",
                table: "Technicians",
                column: "TechnicianCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Accounts_AccountId",
                table: "Customers",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Accounts_AccountId",
                table: "Employees",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Accounts_AccountId",
                table: "RefreshTokens",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Accounts_AccountId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Accounts_AccountId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Accounts_AccountId",
                table: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Technicians");

            migrationBuilder.DropTable(
                name: "TechnicianCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Accounts",
                table: "Accounts");

            migrationBuilder.RenameTable(
                name: "Accounts",
                newName: "Account");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_Phone",
                table: "Account",
                newName: "IX_Account_Phone");

            migrationBuilder.RenameIndex(
                name: "IX_Accounts_Email",
                table: "Account",
                newName: "IX_Account_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Account",
                table: "Account",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Account_AccountId",
                table: "Customers",
                column: "AccountId",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Account_AccountId",
                table: "Employees",
                column: "AccountId",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Account_AccountId",
                table: "RefreshTokens",
                column: "AccountId",
                principalTable: "Account",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
