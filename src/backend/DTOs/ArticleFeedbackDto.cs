namespace KnowledgeBase.DTOs;

public class ArticleFeedbackDto
{
    public int FeedbackId { get; set; }
    public int ArticleId { get; set; }
    public string? ArticleTitle { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public bool? IsHelpful { get; set; }
    public string? FeedbackText { get; set; }
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsResolved { get; set; }
    public int? ResolvedBy { get; set; }
    public string? ResolvedByName { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public string? ResolutionNotes { get; set; }
}

public class SubmitFeedbackDto
{
    public int Rating { get; set; }
    public bool? IsHelpful { get; set; }
    public string? FeedbackText { get; set; }
    public string? Category { get; set; }
}

public class ResolveFeedbackDto
{
    public string? ResolutionNotes { get; set; }
}

public class ArticleMetricsDto
{
    public int? MetricId { get; set; }
    public int ArticleId { get; set; }
    public int TotalViews { get; set; }
    public int UniqueViews { get; set; }
    public int TotalFeedback { get; set; }
    public decimal? AverageRating { get; set; }
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
    public DateTime? LastViewedAt { get; set; }
    public DateTime? LastFeedbackAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class FeedbackFilterDto
{
    public bool IncludeResolved { get; set; } = true;
    public string? Category { get; set; }
    public int? MinRating { get; set; }
    public int? MaxRating { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}

public class FeedbackListResultDto
{
    public List<ArticleFeedbackDto> Feedback { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class TopArticleDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public decimal? AverageRating { get; set; }
    public int TotalFeedback { get; set; }
    public int HelpfulCount { get; set; }
    public int NotHelpfulCount { get; set; }
    public int TotalViews { get; set; }
}
