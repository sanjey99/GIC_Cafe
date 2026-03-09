using CafeEmployee.Application.Cafes.Commands;
using CafeEmployee.Application.Cafes.Queries;
using CafeEmployee.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CafeEmployee.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CafesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CafesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CafeDto>>> Get([FromQuery] string? location)
    {
        var result = await _mediator.Send(new GetCafesQuery(location));
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateCafeCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpPut]
    public async Task<ActionResult> Update([FromBody] UpdateCafeCommand command)
    {
        await _mediator.Send(command);
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteCafeCommand(id));
        return NoContent();
    }
}
