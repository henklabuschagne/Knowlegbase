namespace KnowledgeBase.DTOs;

public class DashboardAnalyticsDto
{
    public OverallStatsDto OverallStats { get; set; } = new();
    public List<ViewTrendDto> ViewTrend { get; set; } = new();
    public List<SearchTrendDto> SearchTrend { get; set; } = new();
    public List<TopArticleDto> TopViewedArticles { get; set; } = new();
    public List<TopSearchQueryDto> TopSearchQueries { get; set; } = new();
    public List<ActivitySummaryDto> UserActivitySummary { get; set; } = new();
    public List<FeedbackSummaryDto> FeedbackSummary { get; set; } = new();
}

public class OverallStatsDto
{
    public int TotalPublishedArticles { get; set; }
    public int TotalActiveUsers { get; set; }
    public int TotalViewsInPeriod { get; set; }
    public int TotalSearchesInPeriod { get; set; }
    public int TotalFeedbackInPeriod { get; set; }
    public int PendingRequests { get; set; }
    public int PendingApprovals { get; set; }
}

public class ViewTrendDto
{
    public DateTime ViewDate { get; set; }
    public int ViewCount { get; set; }
    public int UniqueUsers { get; set; }
}

public class SearchTrendDto
{
    public DateTime SearchDate { get; set; }
    public int SearchCount { get; set; }
    public string SearchType { get; set; } = string.Empty;
    public decimal AvgResultsCount { get; set; }
}

public class TopSearchQueryDto
{
    public string SearchQuery { get; set; } = string.Empty;
    public int SearchCount { get; set; }
    public decimal AvgResultsCount { get; set; }
    public string SearchType { get; set; } = string.Empty;
}

public class ActivitySummaryDto
{
    public string ActivityType { get; set; } = string.Empty;
    public int ActivityCount { get; set; }
    public int UniqueUsers { get; set; }
}

public class FeedbackSummaryDto
{
    public decimal? AvgRating { get; set; }
    public int TotalFeedback { get; set; }
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
    public string? Category { get; set; }
    public int ResolvedCount { get; set; }
}

public class ArticleAnalyticsDto
{
    public ArticleBasicInfoDto ArticleInfo { get; set; } = new();
    public ViewStatsDto ViewStats { get; set; } = new();
    public List<ViewTrendDto> ViewTrend { get; set; } = new();
    public FeedbackStatsDto FeedbackStats { get; set; } = new();
    public List<SearchQueryLeadDto> SearchQueries { get; set; } = new();
    public VersionStatsDto VersionStats { get; set; } = new();
}

public class ArticleBasicInfoDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string AuthorName { get; set; } = string.Empty;
}

public class ViewStatsDto
{
    public int TotalViews { get; set; }
    public int UniqueViewers { get; set; }
    public DateTime? FirstViewed { get; set; }
    public DateTime? LastViewed { get; set; }
}

public class FeedbackStatsDto
{
    public decimal? AvgRating { get; set; }
    public int TotalFeedback { get; set; }
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
}

public class SearchQueryLeadDto
{
    public string SearchQuery { get; set; } = string.Empty;
    public int SearchCount { get; set; }
    public int? ClickPosition { get; set; }
}

public class VersionStatsDto
{
    public int TotalVersions { get; set; }
}

public class UserAnalyticsDto
{
    public UserBasicInfoDto UserInfo { get; set; } = new();
    public UserActivityStatsDto ActivityStats { get; set; } = new();
    public List<ActivityBreakdownDto> ActivityBreakdown { get; set; } = new();
    public UserContentStatsDto ContentStats { get; set; } = new();
}

public class UserBasicInfoDto
{
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; }
}

public class UserActivityStatsDto
{
    public int TotalActivities { get; set; }
    public DateTime? FirstActivity { get; set; }
    public DateTime? LastActivity { get; set; }
}

public class ActivityBreakdownDto
{
    public string ActivityType { get; set; } = string.Empty;
    public int ActivityCount { get; set; }
}

public class UserContentStatsDto
{
    public int ArticlesCreated { get; set; }
    public int ArticlesViewed { get; set; }
    public int TotalSearches { get; set; }
    public decimal? AvgResultsCount { get; set; }
    public int FeedbackProvided { get; set; }
    public decimal? AvgRatingGiven { get; set; }
    public int RequestsMade { get; set; }
}

public class SearchAnalyticsDto
{
    public SearchOverallStatsDto OverallStats { get; set; } = new();
    public List<SearchTypeStatsDto> SearchByType { get; set; } = new();
    public List<TopSearchQueryDto> TopSearchQueries { get; set; } = new();
    public List<NoResultQueryDto> NoResultQueries { get; set; } = new();
    public List<ClickedArticleDto> MostClickedArticles { get; set; } = new();
    public List<SearchTrendPointDto> SearchTrend { get; set; } = new();
}

public class SearchOverallStatsDto
{
    public int TotalSearches { get; set; }
    public int UniqueSearchers { get; set; }
    public decimal AvgResultsCount { get; set; }
    public decimal? AvgResponseTimeMs { get; set; }
    public int SearchesWithClicks { get; set; }
    public decimal ClickThroughRate { get; set; }
}

public class SearchTypeStatsDto
{
    public string SearchType { get; set; } = string.Empty;
    public int SearchCount { get; set; }
    public decimal AvgResultsCount { get; set; }
    public decimal? AvgResponseTimeMs { get; set; }
    public int ClickCount { get; set; }
}

public class NoResultQueryDto
{
    public string SearchQuery { get; set; } = string.Empty;
    public int SearchCount { get; set; }
    public string SearchType { get; set; } = string.Empty;
}

public class ClickedArticleDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ClickCount { get; set; }
    public decimal AvgClickPosition { get; set; }
}

public class SearchTrendPointDto
{
    public DateTime SearchDate { get; set; }
    public int SearchCount { get; set; }
    public int UniqueSearchers { get; set; }
}

public class TrackViewDto
{
    public string? SessionId { get; set; }
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
}

public class LogSearchDto
{
    public string SearchQuery { get; set; } = string.Empty;
    public string SearchType { get; set; } = string.Empty;
    public int ResultsCount { get; set; }
    public int? ClickedArticleId { get; set; }
    public int? ClickPosition { get; set; }
    public int? ResponseTimeMs { get; set; }
    public string? SessionId { get; set; }
}

public class LogActivityDto
{
    public string ActivityType { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public int? EntityId { get; set; }
    public string? Details { get; set; }
    public string? SessionId { get; set; }
}
