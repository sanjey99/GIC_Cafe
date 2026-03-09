using CafeEmployee.Application.Interfaces;
using CafeEmployee.Domain.Entities;
using CafeEmployee.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployee.Infrastructure.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Employee>> GetAllAsync(string? cafeName = null, CancellationToken ct = default)
    {
        var query = _context.Employees
            .Include(e => e.Cafe)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(cafeName))
        {
            query = query.Where(e => e.Cafe != null && e.Cafe.Name.ToLower() == cafeName.ToLower());
        }

        return await query.ToListAsync(ct);
    }

    public async Task<Employee?> GetByIdAsync(string id, CancellationToken ct = default)
    {
        return await _context.Employees
            .Include(e => e.Cafe)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    public async Task AddAsync(Employee employee, CancellationToken ct = default)
    {
        await _context.Employees.AddAsync(employee, ct);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Employee employee, CancellationToken ct = default)
    {
        _context.Employees.Update(employee);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(string id, CancellationToken ct = default)
    {
        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (employee is not null)
        {
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync(ct);
        }
    }
}
