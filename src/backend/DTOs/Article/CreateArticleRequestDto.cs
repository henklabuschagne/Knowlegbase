using System.ComponentModel.DataAnnotations;

namespace KnowledgeBase.API.DTOs.Article;

public class CreateArticleRequestDto
{
    [Required]
    [StringLength(500)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Summary { get; set; }
    
    public string? Content { get; set; }
    
    public int StatusId { get; set; } = 1; // Default to Draft
    
    public bool IsInternal { get; set; } = false;
    
    // Client association (NEW - synced with frontend)
    public int? ClientId { get; set; }
    
    public List<int> TagIds { get; set; } = new();
}