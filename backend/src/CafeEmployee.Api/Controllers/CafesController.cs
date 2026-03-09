using CafeEmployee.Application.Cafes.Commands;
using CafeEmployee.Application.Cafes.Queries;
using CafeEmployee.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployee.Api.Controllers;

[ApiController]
public class CafesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CafesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Returns all cafés, ordered by highest number of employees first.
    /// Optionally filtered by location.
    /// </summary>
    [HttpGet("/cafes")]
    public async Task<ActionResult<IEnumerable<CafeDto>>> Get([FromQuery] string? location)
    {
        var result = await _mediator.Send(new GetCafesQuery(location));
        return Ok(result);
    }

    /// <summary>
    /// Creates a new café record.
    /// </summary>
    [HttpPost("/cafe")]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateCafeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    /// <summary>
    /// Updates an existing café record.
    /// </summary>
    [HttpPut("/cafe")]
    public async Task<ActionResult> Update([FromBody] UpdateCafeCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    /// <summary>
    /// Deletes an existing café and its associated employees.
    /// </summary>
    [HttpDelete("/cafe")]
    public async Task<ActionResult> Delete([FromQuery] Guid id)
    {
        await _mediator.Send(new DeleteCafeCommand(id));
        return NoContent();
    }
}
