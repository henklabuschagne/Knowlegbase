using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IAnalyticsRepository
{
    Task TrackArticleViewAsync(int articleId, int? userId, TrackViewDto trackData);
    Task<int> LogSearchAsync(int? userId, LogSearchDto searchData);
    Task<int> LogUserActivityAsync(int userId, LogActivityDto activityData);
    Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(DateTime? startDate, DateTime? endDate);
    Task<ArticleAnalyticsDto> GetArticleAnalyticsAsync(int articleId, DateTime? startDate, DateTime? endDate);
    Task<UserAnalyticsDto> GetUserAnalyticsAsync(int userId, DateTime? startDate, DateTime? endDate);
    Task<SearchAnalyticsDto> GetSearchAnalyticsAsync(DateTime? startDate, DateTime? endDate);
}

public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly string _connectionString;

    public AnalyticsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task TrackArticleViewAsync(int articleId, int? userId, TrackViewDto trackData)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            UserId = userId,
            trackData.SessionId,
            trackData.UserAgent,
            trackData.IpAddress
        };

        await connection.ExecuteAsync(
            "sp_TrackArticleView",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<int> LogSearchAsync(int? userId, LogSearchDto searchData)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            searchData.SearchQuery,
            searchData.SearchType,
            searchData.ResultsCount,
            searchData.ClickedArticleId,
            searchData.ClickPosition,
            searchData.ResponseTimeMs,
            searchData.SessionId
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_LogSearch",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.SearchId ?? 0;
    }

    public async Task<int> LogUserActivityAsync(int userId, LogActivityDto activityData)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            activityData.ActivityType,
            activityData.EntityType,
            activityData.EntityId,
            activityData.Details,
            activityData.SessionId
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_LogUserActivity",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.ActivityId ?? 0;
    }

    public async Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetAnalyticsDashboard",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var result = new DashboardAnalyticsDto
        {
            OverallStats = await multi.ReadFirstOrDefaultAsync<OverallStatsDto>() ?? new(),
            ViewTrend = (await multi.ReadAsync<ViewTrendDto>()).ToList(),
            SearchTrend = (await multi.ReadAsync<SearchTrendDto>()).ToList(),
            TopViewedArticles = (await multi.ReadAsync<TopArticleDto>()).ToList(),
            TopSearchQueries = (await multi.ReadAsync<TopSearchQueryDto>()).ToList(),
            UserActivitySummary = (await multi.ReadAsync<ActivitySummaryDto>()).ToList(),
            FeedbackSummary = (await multi.ReadAsync<FeedbackSummaryDto>()).ToList()
        };

        return result;
    }

    public async Task<ArticleAnalyticsDto> GetArticleAnalyticsAsync(int articleId, DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            ArticleId = articleId,
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetArticleAnalytics",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var result = new ArticleAnalyticsDto
        {
            ArticleInfo = await multi.ReadFirstOrDefaultAsync<ArticleBasicInfoDto>() ?? new(),
            ViewStats = await multi.ReadFirstOrDefaultAsync<ViewStatsDto>() ?? new(),
            ViewTrend = (await multi.ReadAsync<ViewTrendDto>()).ToList(),
            FeedbackStats = await multi.ReadFirstOrDefaultAsync<FeedbackStatsDto>() ?? new(),
            SearchQueries = (await multi.ReadAsync<SearchQueryLeadDto>()).ToList(),
            VersionStats = await multi.ReadFirstOrDefaultAsync<VersionStatsDto>() ?? new()
        };

        return result;
    }

    public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(int userId, DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetUserAnalytics",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var userInfo = await multi.ReadFirstOrDefaultAsync<UserBasicInfoDto>() ?? new();
        var activityStats = await multi.ReadFirstOrDefaultAsync<UserActivityStatsDto>() ?? new();
        var activityBreakdown = (await multi.ReadAsync<ActivityBreakdownDto>()).ToList();

        // Read content stats (multiple result sets)
        var articlesCreated = await multi.ReadFirstOrDefaultAsync<dynamic>();
        var articlesViewed = await multi.ReadFirstOrDefaultAsync<dynamic>();
        var searches = await multi.ReadFirstOrDefaultAsync<dynamic>();
        var feedback = await multi.ReadFirstOrDefaultAsync<dynamic>();
        var requests = await multi.ReadFirstOrDefaultAsync<dynamic>();

        var contentStats = new UserContentStatsDto
        {
            ArticlesCreated = articlesCreated?.ArticlesCreated ?? 0,
            ArticlesViewed = articlesViewed?.ArticlesViewed ?? 0,
            TotalSearches = searches?.TotalSearches ?? 0,
            AvgResultsCount = searches?.AvgResultsCount,
            FeedbackProvided = feedback?.FeedbackProvided ?? 0,
            AvgRatingGiven = feedback?.AvgRatingGiven,
            RequestsMade = requests?.RequestsMade ?? 0
        };

        return new UserAnalyticsDto
        {
            UserInfo = userInfo,
            ActivityStats = activityStats,
            ActivityBreakdown = activityBreakdown,
            ContentStats = contentStats
        };
    }

    public async Task<SearchAnalyticsDto> GetSearchAnalyticsAsync(DateTime? startDate, DateTime? endDate)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            StartDate = startDate,
            EndDate = endDate
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetSearchAnalytics",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var result = new SearchAnalyticsDto
        {
            OverallStats = await multi.ReadFirstOrDefaultAsync<SearchOverallStatsDto>() ?? new(),
            SearchByType = (await multi.ReadAsync<SearchTypeStatsDto>()).ToList(),
            TopSearchQueries = (await multi.ReadAsync<TopSearchQueryDto>()).ToList(),
            NoResultQueries = (await multi.ReadAsync<NoResultQueryDto>()).ToList(),
            MostClickedArticles = (await multi.ReadAsync<ClickedArticleDto>()).ToList(),
            SearchTrend = (await multi.ReadAsync<SearchTrendPointDto>()).ToList()
        };

        return result;
    }
}
