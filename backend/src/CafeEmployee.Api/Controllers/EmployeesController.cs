using CafeEmployee.Application.DTOs;
using CafeEmployee.Application.Employees.Commands;
using CafeEmployee.Application.Employees.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployee.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> Get([FromQuery] string? cafe)
    {
        var result = await _mediator.Send(new GetEmployeesQuery(cafe));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<string>> Create([FromBody] CreateEmployeeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateEmployeeCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        await _mediator.Send(new DeleteEmployeeCommand(id));
        return NoContent();
    }
}
