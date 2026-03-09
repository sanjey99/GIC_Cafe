# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY src/CafeEmployee.Domain/CafeEmployee.Domain.csproj CafeEmployee.Domain/
COPY src/CafeEmployee.Application/CafeEmployee.Application.csproj CafeEmployee.Application/
COPY src/CafeEmployee.Infrastructure/CafeEmployee.Infrastructure.csproj CafeEmployee.Infrastructure/
COPY src/CafeEmployee.Api/CafeEmployee.Api.csproj CafeEmployee.Api/
COPY src/CafeEmployee.sln .
RUN dotnet restore CafeEmployee.sln

# Copy everything and build
COPY src/ .
RUN dotnet publish CafeEmployee.Api/CafeEmployee.Api.csproj -c Release -o /app/publish --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000
ENTRYPOINT ["dotnet", "CafeEmployee.Api.dll"]
