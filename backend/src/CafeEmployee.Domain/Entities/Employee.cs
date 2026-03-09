using CafeEmployee.Domain.Enums;

namespace CafeEmployee.Domain.Entities;

public class Employee
{
    public string Id { get; set; } = string.Empty; // UIXXXXXXX format
    public string Name { get; set; } = string.Empty;
    public string EmailAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public Gender Gender { get; set; }

    // Foreign key
    public Guid? CafeId { get; set; }
    public DateTime? StartDate { get; set; }

    // Navigation property
    public Cafe? Cafe { get; set; }
}
