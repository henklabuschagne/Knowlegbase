using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivityLogController : ControllerBase
{
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly ILogger<ActivityLogController> _logger;

    public ActivityLogController(
        IActivityLogRepository activityLogRepository,
        ILogger<ActivityLogController> logger)
    {
        _activityLogRepository = activityLogRepository;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> LogActivity([FromBody] CreateActivityLogDto log)
    {
        try
        {
            // Get IP and User Agent from request
            log.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            log.UserAgent = Request.Headers["User-Agent"].ToString();

            var activityId = await _activityLogRepository.LogActivityAsync(log);
            return Ok(new { activityId, message = "Activity logged successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging activity");
            return StatusCode(500, new { message = "An error occurred while logging activity" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<PagedActivityLogsDto>> GetActivityLogs(
        [FromQuery] int? userId = null,
        [FromQuery] string? entityType = null,
        [FromQuery] int? entityId = null,
        [FromQuery] string? action = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var logs = await _activityLogRepository.GetActivityLogsAsync(
                userId, entityType, entityId, action, startDate, endDate, pageNumber, pageSize);
            return Ok(logs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity logs");
            return StatusCode(500, new { message = "An error occurred while retrieving activity logs" });
        }
    }

    [HttpGet("audit")]
    public async Task<ActionResult<PagedAuditTrailDto>> GetAuditTrail(
        [FromQuery] string? tableName = null,
        [FromQuery] int? recordId = null,
        [FromQuery] int? userId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        try
        {
            var audit = await _activityLogRepository.GetAuditTrailAsync(
                tableName, recordId, userId, startDate, endDate, pageNumber, pageSize);
            return Ok(audit);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting audit trail");
            return StatusCode(500, new { message = "An error occurred while retrieving audit trail" });
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ActivityStatsResultDto>> GetActivityStats(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var stats = await _activityLogRepository.GetActivityStatsAsync(startDate, endDate);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity stats");
            return StatusCode(500, new { message = "An error occurred while retrieving activity stats" });
        }
    }
}
