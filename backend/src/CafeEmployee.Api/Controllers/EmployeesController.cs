using CafeEmployee.Application.DTOs;
using CafeEmployee.Application.Employees.Commands;
using CafeEmployee.Application.Employees.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployee.Api.Controllers;

[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Returns all employees, ordered by highest number of days worked first.
    /// Optionally filtered by café name.
    /// </summary>
    [HttpGet("/employees")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> Get([FromQuery] string? cafe)
    {
        var result = await _mediator.Send(new GetEmployeesQuery(cafe));
        return Ok(result);
    }

    /// <summary>
    /// Creates a new employee record.
    /// </summary>
    [HttpPost("/employee")]
    public async Task<ActionResult<string>> Create([FromBody] CreateEmployeeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    /// <summary>
    /// Updates an existing employee record.
    /// </summary>
    [HttpPut("/employee")]
    public async Task<ActionResult> Update([FromBody] UpdateEmployeeCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    /// <summary>
    /// Deletes an existing employee record.
    /// </summary>
    [HttpDelete("/employee")]
    public async Task<ActionResult> Delete([FromQuery] string id)
    {
        await _mediator.Send(new DeleteEmployeeCommand(id));
        return NoContent();
    }
}
