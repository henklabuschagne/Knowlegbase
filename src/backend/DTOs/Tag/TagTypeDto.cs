namespace KnowledgeBase.API.DTOs.Tag;

public class TagTypeDto
{
    public int TagTypeId { get; set; }
    public string TagTypeName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
