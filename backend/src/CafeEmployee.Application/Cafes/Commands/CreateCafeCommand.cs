using MediatR;

namespace CafeEmployee.Application.Cafes.Commands;

public record CreateCafeCommand(
    string Name,
    string Description,
    string? Logo,
    string Location
) : IRequest<Guid>;
