using Dapper;
using KnowledgeBase.API.Models;
using System.Data;
using System.Data.SqlClient;

namespace KnowledgeBase.API.Repositories;

public class TagRepository : ITagRepository
{
    private readonly string _connectionString;

    public TagRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<IEnumerable<TagType>> GetAllTagTypesAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<TagType>(
            "sp_GetAllTagTypes",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<IEnumerable<Tag>> GetAllTagsAsync(int? tagTypeId = null)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<Tag>(
            "sp_GetAllTags",
            new { TagTypeId = tagTypeId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<Tag?> GetTagByIdAsync(int tagId)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<Tag>(
            "sp_GetTagById",
            new { TagId = tagId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> CreateTagAsync(int tagTypeId, string tagName, string tagValue, string? description, string? colorCode)
    {
        using var connection = new SqlConnection(_connectionString);
        var result = await connection.QuerySingleAsync<int>(
            "sp_CreateTag",
            new 
            { 
                TagTypeId = tagTypeId,
                TagName = tagName,
                TagValue = tagValue,
                Description = description,
                ColorCode = colorCode
            },
            commandType: CommandType.StoredProcedure
        );
        return result;
    }

    public async Task UpdateTagAsync(int tagId, string tagName, string tagValue, string? description, string? colorCode)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_UpdateTag",
            new 
            { 
                TagId = tagId,
                TagName = tagName,
                TagValue = tagValue,
                Description = description,
                ColorCode = colorCode
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task DeleteTagAsync(int tagId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteTag",
            new { TagId = tagId },
            commandType: CommandType.StoredProcedure
        );
    }
}
