using CafeEmployee.Domain.Enums;
using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public record CreateEmployeeCommand(
    string Name,
    string EmailAddress,
    string PhoneNumber,
    Gender Gender,
    Guid? CafeId
) : IRequest<string>;
