namespace KnowledgeBase.DTOs;

public class ArticleTemplateDto
{
    public int TemplateId { get; set; }
    public string TemplateName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? TitleTemplate { get; set; }
    public string ContentTemplate { get; set; } = string.Empty;
    public string? SummaryTemplate { get; set; }
    public bool IsInternal { get; set; }
    public bool IsActive { get; set; } = true;
    public int UsageCount { get; set; }
    public int CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TemplateFieldDto> Fields { get; set; } = new();
    public List<TagDto> Tags { get; set; } = new();
}

public class CreateArticleTemplateDto
{
    public string TemplateName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? TitleTemplate { get; set; }
    public string ContentTemplate { get; set; } = string.Empty;
    public string? SummaryTemplate { get; set; }
    public bool IsInternal { get; set; }
    public List<CreateTemplateFieldDto> Fields { get; set; } = new();
    public List<int> TagIds { get; set; } = new();
}

public class UpdateArticleTemplateDto
{
    public string TemplateName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public string? TitleTemplate { get; set; }
    public string ContentTemplate { get; set; } = string.Empty;
    public string? SummaryTemplate { get; set; }
    public bool IsInternal { get; set; }
    public bool IsActive { get; set; } = true;
}

public class TemplateFieldDto
{
    public int FieldId { get; set; }
    public int TemplateId { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string? Placeholder { get; set; }
    public string? DefaultValue { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }
    public string? ValidationRules { get; set; }
    public string? DropdownOptions { get; set; }
}

public class CreateTemplateFieldDto
{
    public string FieldName { get; set; } = string.Empty;
    public string FieldType { get; set; } = string.Empty;
    public string FieldLabel { get; set; } = string.Empty;
    public string? Placeholder { get; set; }
    public string? DefaultValue { get; set; }
    public bool IsRequired { get; set; }
    public int DisplayOrder { get; set; }
    public string? ValidationRules { get; set; }
    public string? DropdownOptions { get; set; }
}

public class CreateArticleFromTemplateDto
{
    public int TemplateId { get; set; }
    public Dictionary<string, string> FieldValues { get; set; } = new();
}
