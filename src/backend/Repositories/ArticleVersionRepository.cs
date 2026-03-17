using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;
using System.Text.Json;

namespace KnowledgeBase.Repositories;

public interface IArticleVersionRepository
{
    Task<int> CreateArticleVersionAsync(CreateArticleVersionDto version, int createdBy);
    Task<List<ArticleVersionListDto>> GetArticleVersionsAsync(int articleId);
    Task<ArticleVersionDto?> GetArticleVersionByIdAsync(int versionId);
    Task<bool> RestoreArticleVersionAsync(int versionId, int restoredBy);
}

public class ArticleVersionRepository : IArticleVersionRepository
{
    private readonly string _connectionString;

    public ArticleVersionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> CreateArticleVersionAsync(CreateArticleVersionDto version, int createdBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var tagIds = version.TagIds != null && version.TagIds.Any()
            ? string.Join(",", version.TagIds)
            : null;

        var parameters = new
        {
            version.ArticleId,
            version.Title,
            version.Content,
            version.Summary,
            version.IsInternal,
            CreatedBy = createdBy,
            version.ChangeDescription,
            TagIds = tagIds
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_CreateArticleVersion",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.VersionId ?? 0;
    }

    public async Task<List<ArticleVersionListDto>> GetArticleVersionsAsync(int articleId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { ArticleId = articleId };

        var versions = await connection.QueryAsync<ArticleVersionListDto>(
            "sp_GetArticleVersions",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return versions.ToList();
    }

    public async Task<ArticleVersionDto?> GetArticleVersionByIdAsync(int versionId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { VersionId = versionId };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_GetArticleVersionById",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        if (result == null)
        {
            return null;
        }

        var version = new ArticleVersionDto
        {
            VersionId = result.VersionId,
            ArticleId = result.ArticleId,
            VersionNumber = result.VersionNumber,
            Title = result.Title,
            Content = result.Content,
            Summary = result.Summary,
            IsInternal = result.IsInternal,
            CreatedBy = result.CreatedBy,
            CreatedByName = result.CreatedByName,
            CreatedAt = result.CreatedAt,
            ChangeDescription = result.ChangeDescription,
        };

        // Parse tags JSON
        if (result.Tags != null && !string.IsNullOrEmpty(result.Tags))
        {
            try
            {
                version.Tags = JsonSerializer.Deserialize<List<TagDto>>(result.Tags);
            }
            catch
            {
                version.Tags = new List<TagDto>();
            }
        }

        return version;
    }

    public async Task<bool> RestoreArticleVersionAsync(int versionId, int restoredBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            VersionId = versionId,
            RestoredBy = restoredBy
        };

        try
        {
            await connection.ExecuteAsync(
                "sp_RestoreArticleVersion",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return true;
        }
        catch
        {
            return false;
        }
    }
}
