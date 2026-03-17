using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IFeedbackRepository
{
    Task<int> SubmitFeedbackAsync(int articleId, int userId, SubmitFeedbackDto feedback);
    Task<List<ArticleFeedbackDto>> GetArticleFeedbackAsync(int articleId, bool includeResolved = true);
    Task<ArticleFeedbackDto?> GetUserArticleFeedbackAsync(int articleId, int userId);
    Task<ArticleMetricsDto> GetArticleMetricsAsync(int articleId);
    Task<bool> ResolveFeedbackAsync(int feedbackId, int resolvedBy, string? resolutionNotes);
    Task<FeedbackListResultDto> GetAllFeedbackAsync(FeedbackFilterDto filter);
    Task<List<TopArticleDto>> GetTopRatedArticlesAsync(int topN = 10, int minFeedbackCount = 3);
    Task<List<TopArticleDto>> GetLowRatedArticlesAsync(int topN = 10, int minFeedbackCount = 3, decimal maxRating = 3.0m);
}

public class FeedbackRepository : IFeedbackRepository
{
    private readonly string _connectionString;

    public FeedbackRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> SubmitFeedbackAsync(int articleId, int userId, SubmitFeedbackDto feedback)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            UserId = userId,
            feedback.Rating,
            feedback.IsHelpful,
            feedback.FeedbackText,
            feedback.Category
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_SubmitArticleFeedback",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.FeedbackId ?? 0;
    }

    public async Task<List<ArticleFeedbackDto>> GetArticleFeedbackAsync(int articleId, bool includeResolved = true)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            IncludeResolved = includeResolved
        };

        var feedback = await connection.QueryAsync<ArticleFeedbackDto>(
            "sp_GetArticleFeedback",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return feedback.ToList();
    }

    public async Task<ArticleFeedbackDto?> GetUserArticleFeedbackAsync(int articleId, int userId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            UserId = userId
        };

        var feedback = await connection.QueryFirstOrDefaultAsync<ArticleFeedbackDto>(
            "sp_GetUserArticleFeedback",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return feedback;
    }

    public async Task<ArticleMetricsDto> GetArticleMetricsAsync(int articleId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { ArticleId = articleId };

        var metrics = await connection.QueryFirstOrDefaultAsync<ArticleMetricsDto>(
            "sp_GetArticleMetrics",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return metrics ?? new ArticleMetricsDto { ArticleId = articleId };
    }

    public async Task<bool> ResolveFeedbackAsync(int feedbackId, int resolvedBy, string? resolutionNotes)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            FeedbackId = feedbackId,
            ResolvedBy = resolvedBy,
            ResolutionNotes = resolutionNotes
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_ResolveFeedback",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.RowsAffected > 0;
    }

    public async Task<FeedbackListResultDto> GetAllFeedbackAsync(FeedbackFilterDto filter)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            filter.IncludeResolved,
            CategoryFilter = filter.Category,
            filter.MinRating,
            filter.MaxRating,
            filter.PageNumber,
            filter.PageSize
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetAllFeedback",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var feedback = await multi.ReadAsync<ArticleFeedbackDto>();
        var totalCount = await multi.ReadFirstOrDefaultAsync<int>();

        return new FeedbackListResultDto
        {
            Feedback = feedback.ToList(),
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }

    public async Task<List<TopArticleDto>> GetTopRatedArticlesAsync(int topN = 10, int minFeedbackCount = 3)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TopN = topN,
            MinFeedbackCount = minFeedbackCount
        };

        var articles = await connection.QueryAsync<TopArticleDto>(
            "sp_GetTopRatedArticles",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return articles.ToList();
    }

    public async Task<List<TopArticleDto>> GetLowRatedArticlesAsync(int topN = 10, int minFeedbackCount = 3, decimal maxRating = 3.0m)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TopN = topN,
            MinFeedbackCount = minFeedbackCount,
            MaxRating = maxRating
        };

        var articles = await connection.QueryAsync<TopArticleDto>(
            "sp_GetLowRatedArticles",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return articles.ToList();
    }
}
