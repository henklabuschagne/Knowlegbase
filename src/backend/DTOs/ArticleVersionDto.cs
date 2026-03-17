namespace KnowledgeBase.DTOs;

public class ArticleVersionDto
{
    public int VersionId { get; set; }
    public int ArticleId { get; set; }
    public int VersionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public bool IsInternal { get; set; }
    public int CreatedBy { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? ChangeDescription { get; set; }
    public List<TagDto>? Tags { get; set; }
}

public class ArticleVersionListDto
{
    public int VersionId { get; set; }
    public int ArticleId { get; set; }
    public int VersionNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public bool IsInternal { get; set; }
    public int CreatedBy { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? ChangeDescription { get; set; }
    public string? TagIds { get; set; }
}

public class CreateArticleVersionDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public bool IsInternal { get; set; }
    public string? ChangeDescription { get; set; }
    public List<int>? TagIds { get; set; }
}

public class VersionComparisonDto
{
    public ArticleVersionDto OldVersion { get; set; } = null!;
    public ArticleVersionDto NewVersion { get; set; } = null!;
    public List<VersionDiffDto> Differences { get; set; } = new();
}

public class VersionDiffDto
{
    public string Field { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public string DiffType { get; set; } = string.Empty; // "added", "removed", "modified"
}

public class UpdateArticleWithVersionDto
{
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public string Content { get; set; } = string.Empty;
    public int? StatusId { get; set; }
    public bool? IsInternal { get; set; }
    public List<int>? TagIds { get; set; }
    public string? ChangeDescription { get; set; }
}
