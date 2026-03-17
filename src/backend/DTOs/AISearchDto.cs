namespace KnowledgeBase.DTOs;

public class AISearchResultDto
{
    public string Query { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public List<ArticleSummaryDto> RelevantArticles { get; set; } = new();
    public DateTime Timestamp { get; set; }
}

public class ArticleSummaryDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
}

public class AISearchRequestDto
{
    public string Query { get; set; } = string.Empty;
    public List<int>? TagIds { get; set; }
}

public class AIChatMessageDto
{
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public List<ArticleSummaryDto>? RelevantArticles { get; set; }
}

public class AIChatRequestDto
{
    public string Message { get; set; } = string.Empty;
    public List<AIChatMessageDto> ConversationHistory { get; set; } = new();
    public List<int>? TagIds { get; set; }
}

public class AIChatResponseDto
{
    public string Response { get; set; } = string.Empty;
    public List<ArticleSummaryDto> RelevantArticles { get; set; } = new();
    public DateTime Timestamp { get; set; }
}
