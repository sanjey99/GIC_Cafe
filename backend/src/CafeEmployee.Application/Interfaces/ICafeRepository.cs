using CafeEmployee.Domain.Entities;

namespace CafeEmployee.Application.Interfaces;

public interface ICafeRepository
{
    Task<IEnumerable<Cafe>> GetAllAsync(string? location = null, CancellationToken ct = default);
    Task<Cafe?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(Cafe cafe, CancellationToken ct = default);
    Task UpdateAsync(Cafe cafe, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
