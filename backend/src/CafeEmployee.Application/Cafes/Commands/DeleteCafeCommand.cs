using MediatR;

namespace CafeEmployee.Application.Cafes.Commands;

public record DeleteCafeCommand(Guid Id) : IRequest<Unit>;
