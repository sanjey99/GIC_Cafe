using FluentValidation;

namespace CafeEmployee.Application.Employees.Commands;

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(6).WithMessage("Name must be at least 6 characters.")
            .MaximumLength(10).WithMessage("Name must not exceed 10 characters.");

        RuleFor(x => x.EmailAddress)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^[89]\d{7}$").WithMessage("Phone must start with 8 or 9 and have 8 digits.");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Gender must be Male or Female.");
    }
}
