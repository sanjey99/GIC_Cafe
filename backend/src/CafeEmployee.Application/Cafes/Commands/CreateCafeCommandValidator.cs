using FluentValidation;

namespace CafeEmployee.Application.Cafes.Commands;

public class CreateCafeCommandValidator : AbstractValidator<CreateCafeCommand>
{
    public CreateCafeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(6).WithMessage("Name must be at least 6 characters.")
            .MaximumLength(10).WithMessage("Name must not exceed 10 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(256).WithMessage("Description must not exceed 256 characters.");

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Location is required.");
    }
}
