using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IUserRepository
{
    Task<UserDto?> GetUserByEmailAsync(string email);
    Task<UserDto?> GetUserByIdAsync(int userId);
    Task<int> CreateUserAsync(CreateUserDto user);
    Task<bool> UpdateUserAsync(int userId, UpdateUserDto user);
    Task<bool> DeleteUserAsync(int userId);
    Task<PaginatedResult<UserDto>> GetUsersAsync(UserQueryParams queryParams);
    Task<bool> SaveUserAIApiKeyAsync(int userId, string apiKey);
    Task<string?> GetUserAIApiKeyAsync(int userId);
}

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new { Email = email };
        
        var user = await connection.QueryFirstOrDefaultAsync<UserDto>(
            "sp_GetUserByEmail",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return user;
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new { UserId = userId };
        
        var user = await connection.QueryFirstOrDefaultAsync<UserDto>(
            "sp_GetUserById",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return user;
    }

    public async Task<int> CreateUserAsync(CreateUserDto user)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            user.Email,
            user.PasswordHash,
            user.FirstName,
            user.LastName,
            user.RoleId
        };

        var userId = await connection.ExecuteScalarAsync<int>(
            "sp_CreateUser",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return userId;
    }

    public async Task<bool> UpdateUserAsync(int userId, UpdateUserDto user)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            UserId = userId,
            user.FirstName,
            user.LastName,
            user.RoleId,
            user.IsActive
        };

        var rowsAffected = await connection.ExecuteAsync(
            "sp_UpdateUser",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return rowsAffected > 0;
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new { UserId = userId };

        var rowsAffected = await connection.ExecuteAsync(
            "sp_DeleteUser",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return rowsAffected > 0;
    }

    public async Task<PaginatedResult<UserDto>> GetUsersAsync(UserQueryParams queryParams)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            queryParams.SearchQuery,
            queryParams.RoleId,
            queryParams.IsActive,
            queryParams.PageNumber,
            queryParams.PageSize
        };

        var users = await connection.QueryAsync<dynamic>(
            "sp_GetUsers",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var userList = users.Select(u => new UserDto
        {
            UserId = u.UserId,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            RoleId = u.RoleId,
            RoleName = u.RoleName,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt,
            TotalCount = u.TotalCount
        }).ToList();

        var totalCount = userList.FirstOrDefault()?.TotalCount ?? 0;

        return new PaginatedResult<UserDto>
        {
            Data = userList,
            TotalCount = totalCount,
            PageNumber = queryParams.PageNumber,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<bool> SaveUserAIApiKeyAsync(int userId, string apiKey)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new
        {
            UserId = userId,
            ApiKey = apiKey
        };

        var rowsAffected = await connection.ExecuteAsync(
            "sp_SaveUserAIApiKey",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return rowsAffected > 0;
    }

    public async Task<string?> GetUserAIApiKeyAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var parameters = new { UserId = userId };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_GetUserAIApiKey",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.ApiKey;
    }
}
