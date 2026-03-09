using CafeEmployee.Domain.Entities;
using CafeEmployee.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CafeEmployee.Infrastructure.Persistence.Seed;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Cafes.AnyAsync())
            return;

        // 5 Cafes
        var cafes = new List<Cafe>
        {
            new() { Id = Guid.NewGuid(), Name = "BeansBrew", Description = "Quality craft coffee in the heart of Tanjong Pagar", Logo = null, Location = "Tanjong Pagar" },
            new() { Id = Guid.NewGuid(), Name = "CafeNoir", Description = "A French-inspired bistro cafe with artisan pastries", Logo = null, Location = "Orchard" },
            new() { Id = Guid.NewGuid(), Name = "KopiCorner", Description = "Local kopi culture meets modern cafe vibes", Logo = null, Location = "Bugis" },
            new() { Id = Guid.NewGuid(), Name = "BrewLab88", Description = "Experimental coffee brews with a scientific approach", Logo = null, Location = "Raffles Place" },
            new() { Id = Guid.NewGuid(), Name = "MochaMaven", Description = "Specializing in mocha and chocolate-infused drinks", Logo = null, Location = "Marina Bay" }
        };

        await context.Cafes.AddRangeAsync(cafes);

        var random = new Random(42);
        var names = new[] { "AliceTan", "BobCheng", "CharlieL", "DianaKoh", "EdwardNg", "FionaLee", "GeorgeSn", "HannahWu", "IvanLim", "JennyOng", "KennethT", "LindaChn", "MichaelW", "NatalieP", "OliverTn", "PamelaYu", "QuentinR", "RachelSg", "SamuelKw", "TinaYeoh" };
        var emails = new[] { "alice@mail.com", "bob@mail.com", "charlie@mail.com", "diana@mail.com", "edward@mail.com", "fiona@mail.com", "george@mail.com", "hannah@mail.com", "ivan@mail.com", "jenny@mail.com", "kenneth@mail.com", "linda@mail.com", "michael@mail.com", "natalie@mail.com", "oliver@mail.com", "pamela@mail.com", "quentin@mail.com", "rachel@mail.com", "samuel@mail.com", "tina@mail.com" };
        var phones = new[] { "91234567", "82345678", "93456789", "84567890", "95678901", "86789012", "97890123", "88901234", "99012345", "80123456", "91112222", "82223333", "93334444", "84445555", "95556666", "86667777", "97778888", "88889999", "99990000", "80001111" };

        var employees = new List<Employee>();
        for (int i = 0; i < 20; i++)
        {
            var gender = i % 2 == 0 ? Gender.Male : Gender.Female;
            Guid? cafeId = null;
            DateTime? startDate = null;

            // Assign 16 employees to cafes, leave 4 unassigned
            if (i < 16)
            {
                cafeId = cafes[i % 5].Id;
                startDate = DateTime.UtcNow.AddDays(-random.Next(30, 730));
            }

            var suffix = $"{i:D3}" + new string(Enumerable.Range(0, 4).Select(_ => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[random.Next(36)]).ToArray());

            employees.Add(new Employee
            {
                Id = $"UI{suffix}",
                Name = names[i],
                EmailAddress = emails[i],
                PhoneNumber = phones[i],
                Gender = gender,
                CafeId = cafeId,
                StartDate = startDate
            });
        }

        await context.Employees.AddRangeAsync(employees);
        await context.SaveChangesAsync();
    }
}
