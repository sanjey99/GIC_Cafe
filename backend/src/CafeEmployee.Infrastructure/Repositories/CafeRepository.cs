using CafeEmployee.Application.Interfaces;
using CafeEmployee.Domain.Entities;
using CafeEmployee.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployee.Infrastructure.Repositories;

public class CafeRepository : ICafeRepository
{
    private readonly AppDbContext _context;

    public CafeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Cafe>> GetAllAsync(string? location = null, CancellationToken ct = default)
    {
        var query = _context.Cafes
            .Include(c => c.Employees)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(location))
        {
            query = query.Where(c => c.Location.ToLower() == location.ToLower());
        }

        return await query.ToListAsync(ct);
    }

    public async Task<Cafe?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _context.Cafes
            .Include(c => c.Employees)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task AddAsync(Cafe cafe, CancellationToken ct = default)
    {
        await _context.Cafes.AddAsync(cafe, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Cafe cafe, CancellationToken ct = default)
    {
        _context.Cafes.Update(cafe);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var cafe = await _context.Cafes
            .Include(c => c.Employees)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        if (cafe is not null)
        {
            _context.Cafes.Remove(cafe); // Cascade will remove employees
            await _context.SaveChangesAsync(ct);
        }
    }
}
