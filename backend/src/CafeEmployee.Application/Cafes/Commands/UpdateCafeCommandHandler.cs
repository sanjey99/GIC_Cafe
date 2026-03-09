using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Cafes.Commands;

public class UpdateCafeCommandHandler : IRequestHandler<UpdateCafeCommand, Unit>
{
    private readonly ICafeRepository _cafeRepository;

    public UpdateCafeCommandHandler(ICafeRepository cafeRepository)
    {
        _cafeRepository = cafeRepository;
    }

    public async Task<Unit> Handle(UpdateCafeCommand request, CancellationToken cancellationToken)
    {
        var cafe = await _cafeRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Cafe with id '{request.Id}' not found.");

        cafe.Name = request.Name;
        cafe.Description = request.Description;
        cafe.Logo = request.Logo;
        cafe.Location = request.Location;

        await _cafeRepository.UpdateAsync(cafe, cancellationToken);
        return Unit.Value;
    }
}
