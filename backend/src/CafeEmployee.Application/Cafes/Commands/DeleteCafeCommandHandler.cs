using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Cafes.Commands;

public class DeleteCafeCommandHandler : IRequestHandler<DeleteCafeCommand, Unit>
{
    private readonly ICafeRepository _cafeRepository;

    public DeleteCafeCommandHandler(ICafeRepository cafeRepository)
    {
        _cafeRepository = cafeRepository;
    }

    public async Task<Unit> Handle(DeleteCafeCommand request, CancellationToken cancellationToken)
    {
        await _cafeRepository.DeleteAsync(request.Id, cancellationToken);
        return Unit.Value;
    }
}
