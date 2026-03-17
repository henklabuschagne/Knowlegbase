namespace KnowledgeBase.DTOs;

public class ApprovalDto
{
    public int ApprovalId { get; set; }
    public int ArticleId { get; set; }
    public string ArticleTitle { get; set; } = string.Empty;
    public int ArticleVersionId { get; set; }
    public int SubmittedByUserId { get; set; }
    public string SubmittedByName { get; set; } = string.Empty;
    public int ApprovalLevel { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int TotalCount { get; set; }
}

public class SubmitApprovalDto
{
    public int ArticleId { get; set; }
    public int ArticleVersionId { get; set; }
    public int ApprovalLevel { get; set; } = 1;
}

public class ReviewApprovalDto
{
    public string? Comments { get; set; }
}

public class ApprovalQueryParams
{
    public int? ApprovalLevel { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}