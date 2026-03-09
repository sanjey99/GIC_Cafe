using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CafeEmployee.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cafes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    logo = table.Column<string>(type: "text", nullable: true),
                    location = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cafes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    employee_id = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    name = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    phone = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    gender = table.Column<string>(type: "text", nullable: false),
                    cafe_id = table.Column<Guid>(type: "uuid", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employees", x => x.employee_id);
                    table.ForeignKey(
                        name: "FK_employees_cafes_cafe_id",
                        column: x => x.cafe_id,
                        principalTable: "cafes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_employees_cafe_id",
                table: "employees",
                column: "cafe_id");

            migrationBuilder.CreateIndex(
                name: "IX_employees_email",
                table: "employees",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "cafes");
        }
    }
}
