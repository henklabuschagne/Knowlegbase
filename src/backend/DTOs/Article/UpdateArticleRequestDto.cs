using System.ComponentModel.DataAnnotations;

namespace KnowledgeBase.API.DTOs.Article;

public class UpdateArticleRequestDto
{
    [Required]
    [StringLength(500)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Summary { get; set; }
    
    public string? Content { get; set; }
    
    public int? StatusId { get; set; }
    
    public bool? IsInternal { get; set; }
    
    // Client association (NEW - synced with frontend)
    public int? ClientId { get; set; }
    
    public List<int>? TagIds { get; set; }
}