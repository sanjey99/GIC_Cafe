using CafeEmployee.Domain.Entities;
using CafeEmployee.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CafeEmployee.Infrastructure.Persistence.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.ToTable("employees");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("employee_id")
            .IsRequired()
            .HasMaxLength(9);

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(e => e.EmailAddress)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(256);

        builder.HasIndex(e => e.EmailAddress)
            .IsUnique();

        builder.Property(e => e.PhoneNumber)
            .HasColumnName("phone")
            .IsRequired()
            .HasMaxLength(8);

        builder.Property(e => e.Gender)
            .HasColumnName("gender")
            .IsRequired()
            .HasConversion<string>();

        builder.Property(e => e.CafeId)
            .HasColumnName("cafe_id");

        builder.Property(e => e.StartDate)
            .HasColumnName("start_date");
    }
}
