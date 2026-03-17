using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        IAnalyticsRepository analyticsRepository,
        ILogger<AnalyticsController> logger)
    {
        _analyticsRepository = analyticsRepository;
        _logger = logger;
    }

    [HttpPost("track/view/{articleId}")]
    public async Task<IActionResult> TrackArticleView(int articleId, [FromBody] TrackViewDto trackData)
    {
        try
        {
            var userId = GetUserId();
            await _analyticsRepository.TrackArticleViewAsync(articleId, userId, trackData);
            return Ok(new { message = "View tracked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error tracking article view");
            return StatusCode(500, new { message = "An error occurred while tracking view" });
        }
    }

    [HttpPost("log/search")]
    public async Task<IActionResult> LogSearch([FromBody] LogSearchDto searchData)
    {
        try
        {
            var userId = GetUserId();
            var searchId = await _analyticsRepository.LogSearchAsync(userId, searchData);
            return Ok(new { searchId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging search");
            return StatusCode(500, new { message = "An error occurred while logging search" });
        }
    }

    [HttpPost("log/activity")]
    public async Task<IActionResult> LogActivity([FromBody] LogActivityDto activityData)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var activityId = await _analyticsRepository.LogUserActivityAsync(userId.Value, activityData);
            return Ok(new { activityId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging activity");
            return StatusCode(500, new { message = "An error occurred while logging activity" });
        }
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardAnalyticsDto>> GetDashboardAnalytics(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        try
        {
            var analytics = await _analyticsRepository.GetDashboardAnalyticsAsync(startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard analytics");
            return StatusCode(500, new { message = "An error occurred while retrieving analytics" });
        }
    }

    [HttpGet("article/{articleId}")]
    public async Task<ActionResult<ArticleAnalyticsDto>> GetArticleAnalytics(
        int articleId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        try
        {
            var analytics = await _analyticsRepository.GetArticleAnalyticsAsync(articleId, startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article analytics");
            return StatusCode(500, new { message = "An error occurred while retrieving analytics" });
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserAnalytics(
        int userId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        try
        {
            var analytics = await _analyticsRepository.GetUserAnalyticsAsync(userId, startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user analytics");
            return StatusCode(500, new { message = "An error occurred while retrieving analytics" });
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<SearchAnalyticsDto>> GetSearchAnalytics(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        try
        {
            var analytics = await _analyticsRepository.GetSearchAnalyticsAsync(startDate, endDate);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting search analytics");
            return StatusCode(500, new { message = "An error occurred while retrieving analytics" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
