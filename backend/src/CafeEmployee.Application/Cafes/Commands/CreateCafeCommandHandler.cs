using CafeEmployee.Application.Interfaces;
using CafeEmployee.Domain.Entities;
using MediatR;

namespace CafeEmployee.Application.Cafes.Commands;

public class CreateCafeCommandHandler : IRequestHandler<CreateCafeCommand, Guid>
{
    private readonly ICafeRepository _cafeRepository;

    public CreateCafeCommandHandler(ICafeRepository cafeRepository)
    {
        _cafeRepository = cafeRepository;
    }

    public async Task<Guid> Handle(CreateCafeCommand request, CancellationToken cancellationToken)
    {
        var cafe = new Cafe
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Logo = request.Logo,
            Location = request.Location
        };

        await _cafeRepository.AddAsync(cafe, cancellationToken);
        return cafe.Id;
    }
}
