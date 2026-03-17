namespace KnowledgeBase.DTOs;

public class AdvancedSearchRequestDto
{
    public string? SearchQuery { get; set; }
    public List<int>? StatusIds { get; set; }
    public List<int>? TagIds { get; set; }
    public int? AuthorId { get; set; }
    public bool? IsInternal { get; set; }
    public bool? IsExternal { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
    public DateTime? UpdatedAfter { get; set; }
    public DateTime? UpdatedBefore { get; set; }
    public DateTime? PublishedAfter { get; set; }
    public DateTime? PublishedBefore { get; set; }
    public decimal? MinRating { get; set; }
    public int? MinViewCount { get; set; }
    public bool? HasFeedback { get; set; }
    public int? VersionNumber { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = "CreatedAt";
    public string SortOrder { get; set; } = "DESC";
}

public class AdvancedSearchResultDto
{
    public List<SearchResultArticleDto> Articles { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class SearchResultArticleDto
{
    public int ArticleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Summary { get; set; }
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
    public bool IsInternal { get; set; }
    public int VersionNumber { get; set; }
    public int? ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public int? TotalFeedback { get; set; }
    public int? RelevanceScore { get; set; }
    public int TotalCount { get; set; } // For pagination - populated by SP
}

public class SavedSearchDto
{
    public int SavedSearchId { get; set; }
    public int UserId { get; set; }
    public string SearchName { get; set; } = string.Empty;
    public string? SearchQuery { get; set; }
    public string FilterCriteria { get; set; } = string.Empty; // JSON
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastUsedAt { get; set; }
    public int UseCount { get; set; }
    public string? CreatedByName { get; set; }
}

public class CreateSavedSearchDto
{
    public string SearchName { get; set; } = string.Empty;
    public string? SearchQuery { get; set; }
    public AdvancedSearchRequestDto FilterCriteria { get; set; } = new();
    public bool IsPublic { get; set; }
}

public class SearchHistoryDto
{
    public int HistoryId { get; set; }
    public int UserId { get; set; }
    public string SearchQuery { get; set; } = string.Empty;
    public string? FilterCriteria { get; set; } // JSON
    public int ResultsCount { get; set; }
    public DateTime SearchedAt { get; set; }
}

public class SearchFacetsDto
{
    public List<FacetItemDto> Statuses { get; set; } = new();
    public List<FacetItemDto> Tags { get; set; } = new();
    public List<FacetItemDto> Authors { get; set; } = new();
    public List<FacetItemDto> Visibility { get; set; } = new();
    public List<FacetItemDto> DateRanges { get; set; } = new();
}

public class FacetItemDto
{
    public int? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
    public string? ColorCode { get; set; }
}