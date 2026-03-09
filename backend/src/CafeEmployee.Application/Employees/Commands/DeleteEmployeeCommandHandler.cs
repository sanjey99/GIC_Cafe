using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Employees.Commands;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, Unit>
{
    private readonly IEmployeeRepository _employeeRepository;

    public DeleteEmployeeCommandHandler(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<Unit> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        await _employeeRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
