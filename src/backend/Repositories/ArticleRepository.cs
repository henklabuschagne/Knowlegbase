using Dapper;
using KnowledgeBase.API.Models;
using KnowledgeBase.DTOs;
using System.Data;
using System.Data.SqlClient;

namespace KnowledgeBase.API.Repositories;

public class ArticleRepository : IArticleRepository
{
    private readonly string _connectionString;

    public ArticleRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<(IEnumerable<Article> Articles, int TotalCount)> GetAllArticlesAsync(
        int? userId = null,
        bool? isInternal = null,
        int? statusId = null,
        bool? isPublished = null,
        string? searchTerm = null,
        int pageNumber = 1,
        int pageSize = 20)
    {
        using var connection = new SqlConnection(_connectionString);
        var articles = await connection.QueryAsync<Article>(
            "sp_GetAllArticles",
            new 
            { 
                UserId = userId,
                IsInternal = isInternal,
                StatusId = statusId,
                IsPublished = isPublished,
                SearchTerm = searchTerm,
                PageNumber = pageNumber,
                PageSize = pageSize
            },
            commandType: CommandType.StoredProcedure
        );

        var articleList = articles.ToList();
        var totalCount = articleList.FirstOrDefault()?.TotalCount ?? 0;

        return (articleList, totalCount);
    }

    public async Task<Article?> GetArticleByIdAsync(int articleId)
    {
        using var connection = new SqlConnection(_connectionString);
        using var multi = await connection.QueryMultipleAsync(
            "sp_GetArticleById",
            new { ArticleId = articleId },
            commandType: CommandType.StoredProcedure
        );

        var article = await multi.ReadFirstOrDefaultAsync<Article>();
        if (article != null)
        {
            // Read tags from second result set
            var tags = await multi.ReadAsync<Tag>();
            // Note: Tags will be loaded separately in service layer if needed
        }

        return article;
    }

    public async Task<IEnumerable<Tag>> GetArticleTagsAsync(int articleId)
    {
        using var connection = new SqlConnection(_connectionString);
        using var multi = await connection.QueryMultipleAsync(
            "sp_GetArticleById",
            new { ArticleId = articleId },
            commandType: CommandType.StoredProcedure
        );

        // Skip first result set (article)
        await multi.ReadAsync<Article>();
        
        // Read second result set (tags)
        return await multi.ReadAsync<Tag>();
    }

    public async Task<Article> CreateArticleAsync(string title, string? summary, string? content, int createdBy, int statusId, bool isInternal, List<int>? tagIds)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var tagIdsString = tagIds != null && tagIds.Any() 
            ? string.Join(",", tagIds) 
            : null;

        using var multi = await connection.QueryMultipleAsync(
            "sp_CreateArticle",
            new 
            { 
                Title = title,
                Summary = summary,
                Content = content,
                CreatedBy = createdBy,
                StatusId = statusId,
                IsInternal = isInternal,
                TagIds = tagIdsString
            },
            commandType: CommandType.StoredProcedure
        );

        var article = await multi.ReadFirstAsync<Article>();
        // Skip tags result set for now
        
        return article;
    }

    public async Task<Article> UpdateArticleAsync(int articleId, string title, string? summary, string? content, int updatedBy, int? statusId, bool? isInternal, List<int>? tagIds)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var tagIdsString = tagIds != null 
            ? string.Join(",", tagIds) 
            : null;

        using var multi = await connection.QueryMultipleAsync(
            "sp_UpdateArticleWithVersion",
            new 
            { 
                ArticleId = articleId,
                Title = title,
                Summary = summary,
                Content = content,
                UpdatedBy = updatedBy,
                StatusId = statusId,
                IsInternal = isInternal,
                TagIds = tagIdsString,
                ChangeDescription = (string?)null
            },
            commandType: CommandType.StoredProcedure
        );

        var article = await multi.ReadFirstAsync<Article>();
        return article;
    }

    public async Task<Article> UpdateArticleWithVersionAsync(int articleId, UpdateArticleWithVersionDto dto, int updatedBy)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var tagIdsString = dto.TagIds != null && dto.TagIds.Any()
            ? string.Join(",", dto.TagIds) 
            : null;

        using var multi = await connection.QueryMultipleAsync(
            "sp_UpdateArticleWithVersion",
            new 
            { 
                ArticleId = articleId,
                dto.Title,
                dto.Summary,
                dto.Content,
                UpdatedBy = updatedBy,
                dto.StatusId,
                dto.IsInternal,
                TagIds = tagIdsString,
                dto.ChangeDescription
            },
            commandType: CommandType.StoredProcedure
        );

        var article = await multi.ReadFirstAsync<Article>();
        return article;
    }

    public async Task DeleteArticleAsync(int articleId, int updatedBy)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_DeleteArticle",
            new { ArticleId = articleId, UpdatedBy = updatedBy },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task PublishArticleAsync(int articleId, int approvedBy)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_PublishArticle",
            new { ArticleId = articleId, ApprovedBy = approvedBy },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task IncrementViewCountAsync(int articleId)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "sp_IncrementArticleViewCount",
            new { ArticleId = articleId },
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<(IEnumerable<Article> Articles, int TotalCount)> SearchArticlesByTagsAsync(
        List<int> tagIds, 
        bool? isPublished = true, 
        bool? isInternal = null, 
        int pageNumber = 1, 
        int pageSize = 20)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var tagIdsString = string.Join(",", tagIds);

        var articles = await connection.QueryAsync<Article>(
            "sp_SearchArticlesByTags",
            new 
            { 
                TagIds = tagIdsString,
                IsPublished = isPublished,
                IsInternal = isInternal,
                PageNumber = pageNumber,
                PageSize = pageSize
            },
            commandType: CommandType.StoredProcedure
        );

        var articleList = articles.ToList();
        var totalCount = articleList.FirstOrDefault()?.TotalCount ?? 0;

        return (articleList, totalCount);
    }

    public async Task<IEnumerable<ArticleStatus>> GetAllArticleStatusesAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<ArticleStatus>(
            "sp_GetAllArticleStatuses",
            commandType: CommandType.StoredProcedure
        );
    }
}