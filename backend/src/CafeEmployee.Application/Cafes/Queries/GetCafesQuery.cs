using CafeEmployee.Application.DTOs;
using MediatR;

namespace CafeEmployee.Application.Cafes.Queries;

public record GetCafesQuery(string? Location) : IRequest<IEnumerable<CafeDto>>;
