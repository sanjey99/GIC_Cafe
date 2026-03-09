using CafeEmployee.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CafeEmployee.Infrastructure.Persistence.Configurations;

public class CafeConfiguration : IEntityTypeConfiguration<Cafe>
{
    public void Configure(EntityTypeBuilder<Cafe> builder)
    {
        builder.ToTable("cafes");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("id");

        builder.Property(c => c.Name)
            .HasColumnName("name")
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(c => c.Description)
            .HasColumnName("description")
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.Logo)
            .HasColumnName("logo");

        builder.Property(c => c.Location)
            .HasColumnName("location")
            .IsRequired()
            .HasMaxLength(256);

        builder.HasMany(c => c.Employees)
            .WithOne(e => e.Cafe)
            .HasForeignKey(e => e.CafeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
