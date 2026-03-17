namespace KnowledgeBase.DTOs;

public class ArticleRequestDto
{
    public int RequestId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int RequestedByUserId { get; set; }
    public string RequestedByName { get; set; } = string.Empty;
    public string RequestedByEmail { get; set; } = string.Empty;
    public int? AssignedToUserId { get; set; }
    public string? AssignedToName { get; set; }
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Priority { get; set; }
    public int? ArticleId { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int TotalCount { get; set; }
}

public class CreateArticleRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; } = 2; // Default to Medium
}

public class UpdateArticleRequestDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? StatusId { get; set; }
    public int? Priority { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? RejectionReason { get; set; }
    public int? ArticleId { get; set; }
}

public class ArticleRequestQueryParams
{
    public int? StatusId { get; set; }
    public int? RequestedByUserId { get; set; }
    public int? AssignedToUserId { get; set; }
    public int? Priority { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}