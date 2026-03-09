using CafeEmployee.Application.DTOs;
using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Employees.Queries;

public class GetEmployeesQueryHandler : IRequestHandler<GetEmployeesQuery, IEnumerable<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;

    public GetEmployeesQueryHandler(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    public async Task<IEnumerable<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        var employees = await _employeeRepository.GetAllAsync(request.Cafe, cancellationToken);

        return employees
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                EmailAddress = e.EmailAddress,
                PhoneNumber = e.PhoneNumber,
                DaysWorked = e.StartDate.HasValue
                    ? (int)(DateTime.UtcNow - e.StartDate.Value).TotalDays
                    : 0,
                Cafe = e.Cafe?.Name
            })
            .OrderByDescending(e => e.DaysWorked);
    }
}
