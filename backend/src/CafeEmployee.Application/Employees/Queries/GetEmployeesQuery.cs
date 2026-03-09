using CafeEmployee.Application.DTOs;
using MediatR;

namespace CafeEmployee.Application.Employees.Queries;

public record GetEmployeesQuery(string? Cafe) : IRequest<IEnumerable<EmployeeDto>>;
