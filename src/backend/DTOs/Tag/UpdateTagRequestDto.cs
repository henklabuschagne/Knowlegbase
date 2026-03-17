using System.ComponentModel.DataAnnotations;

namespace KnowledgeBase.API.DTOs.Tag;

public class UpdateTagRequestDto
{
    [Required]
    [StringLength(100)]
    public string TagName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(200)]
    public string TagValue { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [StringLength(7)]
    [RegularExpression(@"^#[0-9A-Fa-f]{6}$", ErrorMessage = "ColorCode must be a valid hex color (e.g., #FF5733)")]
    public string? ColorCode { get; set; }
}
