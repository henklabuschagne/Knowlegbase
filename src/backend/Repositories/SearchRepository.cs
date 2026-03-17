using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface ISearchRepository
{
    Task<AdvancedSearchResultDto> AdvancedSearchAsync(AdvancedSearchRequestDto request);
    Task<SearchFacetsDto> GetSearchFacetsAsync(string? searchQuery);
    Task<int> SaveSearchAsync(int userId, CreateSavedSearchDto saveSearch);
    Task<List<SavedSearchDto>> GetSavedSearchesAsync(int userId);
    Task UpdateSavedSearchUsageAsync(int savedSearchId);
    Task<bool> DeleteSavedSearchAsync(int savedSearchId, int userId);
    Task<int> AddSearchHistoryAsync(int userId, string searchQuery, string? filterCriteria, int resultsCount);
    Task<List<SearchHistoryDto>> GetSearchHistoryAsync(int userId, int limit = 20);
}

public class SearchRepository : ISearchRepository
{
    private readonly string _connectionString;

    public SearchRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<AdvancedSearchResultDto> AdvancedSearchAsync(AdvancedSearchRequestDto request)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            SearchQuery = request.SearchQuery,
            StatusIds = request.StatusIds != null ? string.Join(",", request.StatusIds) : null,
            TagIds = request.TagIds != null ? string.Join(",", request.TagIds) : null,
            request.AuthorId,
            request.IsInternal,
            request.IsExternal,
            request.CreatedAfter,
            request.CreatedBefore,
            request.UpdatedAfter,
            request.UpdatedBefore,
            request.PublishedAfter,
            request.PublishedBefore,
            request.MinRating,
            request.MinViewCount,
            request.HasFeedback,
            request.VersionNumber,
            request.PageNumber,
            request.PageSize,
            request.SortBy,
            request.SortOrder
        };

        var articles = await connection.QueryAsync<SearchResultArticleDto>(
            "sp_AdvancedSearch",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var articleList = articles.ToList();
        var totalCount = articleList.FirstOrDefault()?.TotalCount ?? 0;

        // Remove TotalCount from individual articles (it's just for pagination)
        foreach (var article in articleList)
        {
            // TotalCount is already captured, can be ignored in individual items
        }

        return new AdvancedSearchResultDto
        {
            Articles = articleList,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<SearchFacetsDto> GetSearchFacetsAsync(string? searchQuery)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { SearchQuery = searchQuery };

        using var multi = await connection.QueryMultipleAsync(
            "sp_GetSearchFacets",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var statuses = (await multi.ReadAsync<dynamic>()).Select(x => new FacetItemDto
        {
            Id = (int)x.StatusId,
            Name = (string)x.StatusName,
            Count = (int)x.Count
        }).ToList();

        var tags = (await multi.ReadAsync<dynamic>()).Select(x => new FacetItemDto
        {
            Id = (int)x.TagId,
            Name = (string)x.TagName,
            Count = (int)x.Count,
            ColorCode = x.ColorCode
        }).ToList();

        var authors = (await multi.ReadAsync<dynamic>()).Select(x => new FacetItemDto
        {
            Id = (int)x.UserId,
            Name = (string)x.AuthorName,
            Count = (int)x.Count
        }).ToList();

        var visibility = (await multi.ReadAsync<dynamic>()).Select(x => new FacetItemDto
        {
            Name = (string)x.Visibility,
            Count = (int)x.Count
        }).ToList();

        var dateRanges = (await multi.ReadAsync<dynamic>()).Select(x => new FacetItemDto
        {
            Name = (string)x.DateRange,
            Count = (int)x.Count
        }).ToList();

        return new SearchFacetsDto
        {
            Statuses = statuses,
            Tags = tags,
            Authors = authors,
            Visibility = visibility,
            DateRanges = dateRanges
        };
    }

    public async Task<int> SaveSearchAsync(int userId, CreateSavedSearchDto saveSearch)
    {
        using var connection = new SqlConnection(_connectionString);

        var filterJson = JsonSerializer.Serialize(saveSearch.FilterCriteria);

        var parameters = new
        {
            UserId = userId,
            saveSearch.SearchName,
            saveSearch.SearchQuery,
            FilterCriteria = filterJson,
            saveSearch.IsPublic
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_SaveSearch",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.SavedSearchId ?? 0;
    }

    public async Task<List<SavedSearchDto>> GetSavedSearchesAsync(int userId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { UserId = userId };

        var searches = await connection.QueryAsync<SavedSearchDto>(
            "sp_GetSavedSearches",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return searches.ToList();
    }

    public async Task UpdateSavedSearchUsageAsync(int savedSearchId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { SavedSearchId = savedSearchId };

        await connection.ExecuteAsync(
            "sp_UpdateSavedSearchUsage",
            parameters,
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<bool> DeleteSavedSearchAsync(int savedSearchId, int userId)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            SavedSearchId = savedSearchId,
            UserId = userId
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_DeleteSavedSearch",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.DeletedCount > 0;
    }

    public async Task<int> AddSearchHistoryAsync(int userId, string searchQuery, string? filterCriteria, int resultsCount)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            SearchQuery = searchQuery,
            FilterCriteria = filterCriteria,
            ResultsCount = resultsCount
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_AddSearchHistory",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.HistoryId ?? 0;
    }

    public async Task<List<SearchHistoryDto>> GetSearchHistoryAsync(int userId, int limit = 20)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            Limit = limit
        };

        var history = await connection.QueryAsync<SearchHistoryDto>(
            "sp_GetSearchHistory",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return history.ToList();
    }
}