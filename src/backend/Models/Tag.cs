namespace KnowledgeBase.API.Models;

public class Tag
{
    public int TagId { get; set; }
    public int TagTypeId { get; set; }
    public string TagTypeName { get; set; } = string.Empty;
    public string TagName { get; set; } = string.Empty;
    public string TagValue { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ColorCode { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
