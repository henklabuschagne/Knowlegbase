using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchRepository _searchRepository;
    private readonly ILogger<SearchController> _logger;

    public SearchController(
        ISearchRepository searchRepository,
        ILogger<SearchController> logger)
    {
        _searchRepository = searchRepository;
        _logger = logger;
    }

    [HttpPost("advanced")]
    public async Task<ActionResult<AdvancedSearchResultDto>> AdvancedSearch([FromBody] AdvancedSearchRequestDto request)
    {
        try
        {
            var result = await _searchRepository.AdvancedSearchAsync(request);
            
            // Add to search history if user is authenticated
            var userId = GetUserId();
            if (userId.HasValue)
            {
                var filterJson = System.Text.Json.JsonSerializer.Serialize(request);
                await _searchRepository.AddSearchHistoryAsync(
                    userId.Value,
                    request.SearchQuery ?? "",
                    filterJson,
                    result.TotalCount
                );
            }
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing advanced search");
            return StatusCode(500, new { message = "An error occurred while searching" });
        }
    }

    [HttpGet("facets")]
    public async Task<ActionResult<SearchFacetsDto>> GetSearchFacets([FromQuery] string? searchQuery = null)
    {
        try
        {
            var facets = await _searchRepository.GetSearchFacetsAsync(searchQuery);
            return Ok(facets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting search facets");
            return StatusCode(500, new { message = "An error occurred while retrieving facets" });
        }
    }

    [HttpPost("saved")]
    public async Task<IActionResult> SaveSearch([FromBody] CreateSavedSearchDto saveSearch)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var savedSearchId = await _searchRepository.SaveSearchAsync(userId.Value, saveSearch);
            return Ok(new { savedSearchId, message = "Search saved successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving search");
            return StatusCode(500, new { message = "An error occurred while saving search" });
        }
    }

    [HttpGet("saved")]
    public async Task<ActionResult<List<SavedSearchDto>>> GetSavedSearches()
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var searches = await _searchRepository.GetSavedSearchesAsync(userId.Value);
            return Ok(searches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting saved searches");
            return StatusCode(500, new { message = "An error occurred while retrieving saved searches" });
        }
    }

    [HttpPost("saved/{id}/use")]
    public async Task<IActionResult> UseSavedSearch(int id)
    {
        try
        {
            await _searchRepository.UpdateSavedSearchUsageAsync(id);
            return Ok(new { message = "Search usage updated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating saved search usage");
            return StatusCode(500, new { message = "An error occurred" });
        }
    }

    [HttpDelete("saved/{id}")]
    public async Task<IActionResult> DeleteSavedSearch(int id)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var deleted = await _searchRepository.DeleteSavedSearchAsync(id, userId.Value);
            if (!deleted)
            {
                return NotFound(new { message = "Saved search not found or you don't have permission to delete it" });
            }

            return Ok(new { message = "Saved search deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting saved search");
            return StatusCode(500, new { message = "An error occurred while deleting search" });
        }
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<SearchHistoryDto>>> GetSearchHistory([FromQuery] int limit = 20)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var history = await _searchRepository.GetSearchHistoryAsync(userId.Value, limit);
            return Ok(history);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting search history");
            return StatusCode(500, new { message = "An error occurred while retrieving search history" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
