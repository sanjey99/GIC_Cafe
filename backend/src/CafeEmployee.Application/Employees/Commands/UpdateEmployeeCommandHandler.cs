using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, Unit>
{
    private readonly IEmployeeRepository _employeeRepository;

    public UpdateEmployeeCommandHandler(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<Unit> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Employee with id '{request.Id}' not found.");

        var cafeChanged = employee.CafeId != request.CafeId;

        employee.Name = request.Name;
        employee.EmailAddress = request.EmailAddress;
        employee.PhoneNumber = request.PhoneNumber;
        employee.Gender = request.Gender;
        employee.CafeId = request.CafeId;

        // Reset start date if cafe assignment changed
        if (cafeChanged)
        {
            employee.StartDate = request.CafeId.HasValue ? DateTime.UtcNow : null;
        }

        await _employeeRepository.UpdateAsync(employee, cancellationToken);
        return Unit.Value;
    }
}
