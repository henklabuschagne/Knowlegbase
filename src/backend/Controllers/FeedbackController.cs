using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackRepository _feedbackRepository;
    private readonly ILogger<FeedbackController> _logger;

    public FeedbackController(
        IFeedbackRepository feedbackRepository,
        ILogger<FeedbackController> logger)
    {
        _feedbackRepository = feedbackRepository;
        _logger = logger;
    }

    [HttpPost("articles/{articleId}")]
    public async Task<ActionResult<int>> SubmitFeedback(int articleId, [FromBody] SubmitFeedbackDto feedback)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            if (feedback.Rating < 1 || feedback.Rating > 5)
            {
                return BadRequest(new { message = "Rating must be between 1 and 5" });
            }

            var feedbackId = await _feedbackRepository.SubmitFeedbackAsync(articleId, userId.Value, feedback);

            return Ok(new { feedbackId, message = "Feedback submitted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting feedback");
            return StatusCode(500, new { message = "An error occurred while submitting feedback" });
        }
    }

    [HttpGet("articles/{articleId}")]
    public async Task<ActionResult<List<ArticleFeedbackDto>>> GetArticleFeedback(
        int articleId,
        [FromQuery] bool includeResolved = true)
    {
        try
        {
            var feedback = await _feedbackRepository.GetArticleFeedbackAsync(articleId, includeResolved);
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article feedback");
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    [HttpGet("articles/{articleId}/user")]
    public async Task<ActionResult<ArticleFeedbackDto>> GetUserArticleFeedback(int articleId)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var feedback = await _feedbackRepository.GetUserArticleFeedbackAsync(articleId, userId.Value);

            if (feedback == null)
            {
                return NotFound(new { message = "No feedback found" });
            }

            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user feedback");
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    [HttpGet("articles/{articleId}/metrics")]
    public async Task<ActionResult<ArticleMetricsDto>> GetArticleMetrics(int articleId)
    {
        try
        {
            var metrics = await _feedbackRepository.GetArticleMetricsAsync(articleId);
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article metrics");
            return StatusCode(500, new { message = "An error occurred while retrieving metrics" });
        }
    }

    [HttpPost("{feedbackId}/resolve")]
    public async Task<IActionResult> ResolveFeedback(int feedbackId, [FromBody] ResolveFeedbackDto dto)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var success = await _feedbackRepository.ResolveFeedbackAsync(
                feedbackId,
                userId.Value,
                dto.ResolutionNotes);

            if (!success)
            {
                return NotFound(new { message = "Feedback not found" });
            }

            return Ok(new { message = "Feedback resolved successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resolving feedback");
            return StatusCode(500, new { message = "An error occurred while resolving feedback" });
        }
    }

    [HttpGet("all")]
    public async Task<ActionResult<FeedbackListResultDto>> GetAllFeedback([FromQuery] FeedbackFilterDto filter)
    {
        try
        {
            var result = await _feedbackRepository.GetAllFeedbackAsync(filter);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all feedback");
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    [HttpGet("top-rated")]
    public async Task<ActionResult<List<TopArticleDto>>> GetTopRatedArticles(
        [FromQuery] int topN = 10,
        [FromQuery] int minFeedbackCount = 3)
    {
        try
        {
            var articles = await _feedbackRepository.GetTopRatedArticlesAsync(topN, minFeedbackCount);
            return Ok(articles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting top rated articles");
            return StatusCode(500, new { message = "An error occurred while retrieving top rated articles" });
        }
    }

    [HttpGet("low-rated")]
    public async Task<ActionResult<List<TopArticleDto>>> GetLowRatedArticles(
        [FromQuery] int topN = 10,
        [FromQuery] int minFeedbackCount = 3,
        [FromQuery] decimal maxRating = 3.0m)
    {
        try
        {
            var articles = await _feedbackRepository.GetLowRatedArticlesAsync(topN, minFeedbackCount, maxRating);
            return Ok(articles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting low rated articles");
            return StatusCode(500, new { message = "An error occurred while retrieving low rated articles" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
