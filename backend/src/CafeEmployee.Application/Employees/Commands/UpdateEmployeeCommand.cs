using CafeEmployee.Domain.Enums;
using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public record UpdateEmployeeCommand(
    string Id,
    string Name,
    string EmailAddress,
    string PhoneNumber,
    Gender Gender,
    Guid? CafeId
) : IRequest<Unit>;
