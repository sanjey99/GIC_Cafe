namespace CafeEmployee.Domain.ValueObjects;

public static class EmployeeIdGenerator
{
    private static readonly Random Random = new();
    private const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";

    public static string Generate()
    {
        var suffix = new char[7];
        for (var i = 0; i < 7; i++)
        {
            suffix[i] = Chars[Random.Next(Chars.Length)];
        }
        return $"UI{new string(suffix)}";
    }
}
