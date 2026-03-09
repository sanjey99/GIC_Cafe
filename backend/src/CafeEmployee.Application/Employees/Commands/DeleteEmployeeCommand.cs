using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public record DeleteEmployeeCommand(string Id) : IRequest<Unit>;
