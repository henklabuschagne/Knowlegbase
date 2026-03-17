namespace KnowledgeBase.API.DTOs.Article;

public class ArticleStatusDto
{
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
