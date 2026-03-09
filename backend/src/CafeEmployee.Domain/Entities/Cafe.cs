namespace CafeEmployee.Domain.Entities;

public class Cafe
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Logo { get; set; }
    public string Location { get; set; } = string.Empty;

    // Navigation property
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
