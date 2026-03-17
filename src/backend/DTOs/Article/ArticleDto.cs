using KnowledgeBase.API.DTOs.Tag;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.API.DTOs.Article;

public class ArticleDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    
    public int CreatedBy { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public string? CreatedByEmail { get; set; }
    
    public int? UpdatedBy { get; set; }
    public string? UpdatedByName { get; set; }
    
    public int? ApprovedBy { get; set; }
    public string? ApprovedByName { get; set; }
    
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    
    public bool IsPublished { get; set; }
    public bool IsInternal { get; set; }
    
    // Client association (NEW - synced with frontend)
    public int? ClientId { get; set; }
    public string? ClientName { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    
    public int VersionNumber { get; set; }
    public int? ParentArticleId { get; set; }
    
    public int ViewCount { get; set; }
    
    public List<TagDto> Tags { get; set; } = new();
    
    // Version history (NEW - synced with frontend)
    public List<ArticleVersionListDto>? Versions { get; set; }
}