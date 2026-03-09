using CafeEmployee.Application.Interfaces;
using CafeEmployee.Domain.Entities;
using CafeEmployee.Domain.ValueObjects;
using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, string>
{
    private readonly IEmployeeRepository _employeeRepository;

    public CreateEmployeeCommandHandler(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<string> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = new Employee
        {
            Id = EmployeeIdGenerator.Generate(),
            Name = request.Name,
            EmailAddress = request.EmailAddress,
            PhoneNumber = request.PhoneNumber,
            Gender = request.Gender,
            CafeId = request.CafeId,
            StartDate = request.CafeId.HasValue ? DateTime.UtcNow : null
        };

        await _employeeRepository.AddAsync(employee, cancellationToken);
        return employee.Id;
    }
}
