using CafeEmployee.Application.DTOs;
using CafeEmployee.Application.Interfaces;
using MediatR;

namespace CafeEmployee.Application.Cafes.Queries;

public class GetCafesQueryHandler : IRequestHandler<GetCafesQuery, IEnumerable<CafeDto>>
{
    private readonly ICafeRepository _cafeRepository;

    public GetCafesQueryHandler(ICafeRepository cafeRepository)
    {
        _cafeRepository = cafeRepository;
    }

    public async Task<IEnumerable<CafeDto>> Handle(GetCafesQuery request, CancellationToken cancellationToken)
    {
        var cafes = await _cafeRepository.GetAllAsync(request.Location, cancellationToken);

        return cafes
            .Select(c => new CafeDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Logo = c.Logo,
                Location = c.Location,
                Employees = c.Employees.Count
            })
            .OrderByDescending(c => c.Employees);
    }
}
