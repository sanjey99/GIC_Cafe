using CafeEmployee.Domain.Entities;

namespace CafeEmployee.Application.Interfaces;

public interface IEmployeeRepository
{
    Task<IEnumerable<Employee>> GetAllAsync(string? cafeName = null, CancellationToken ct = default);
    Task<Employee?> GetByIdAsync(string id, CancellationToken ct = default);
    Task AddAsync(Employee employee, CancellationToken ct = default);
    Task UpdateAsync(Employee employee, CancellationToken ct = default);
    Task DeleteAsync(string id, CancellationToken ct = default);
}
