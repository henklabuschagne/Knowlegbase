using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/articles/{articleId}/[controller]")]
public class ArticleVersionsController : ControllerBase
{
    private readonly IArticleVersionRepository _versionRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly ILogger<ArticleVersionsController> _logger;

    public ArticleVersionsController(
        IArticleVersionRepository versionRepository,
        IArticleRepository articleRepository,
        ILogger<ArticleVersionsController> logger)
    {
        _versionRepository = versionRepository;
        _articleRepository = articleRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<ArticleVersionListDto>>> GetArticleVersions(int articleId)
    {
        try
        {
            var versions = await _versionRepository.GetArticleVersionsAsync(articleId);
            return Ok(versions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article versions");
            return StatusCode(500, new { message = "An error occurred while retrieving article versions" });
        }
    }

    [HttpGet("{versionId}")]
    public async Task<ActionResult<ArticleVersionDto>> GetArticleVersion(int articleId, int versionId)
    {
        try
        {
            var version = await _versionRepository.GetArticleVersionByIdAsync(versionId);
            
            if (version == null)
            {
                return NotFound(new { message = "Version not found" });
            }

            if (version.ArticleId != articleId)
            {
                return BadRequest(new { message = "Version does not belong to this article" });
            }

            return Ok(version);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article version");
            return StatusCode(500, new { message = "An error occurred while retrieving the article version" });
        }
    }

    [HttpPost("{versionId}/restore")]
    public async Task<IActionResult> RestoreVersion(int articleId, int versionId)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var version = await _versionRepository.GetArticleVersionByIdAsync(versionId);
            
            if (version == null)
            {
                return NotFound(new { message = "Version not found" });
            }

            if (version.ArticleId != articleId)
            {
                return BadRequest(new { message = "Version does not belong to this article" });
            }

            var success = await _versionRepository.RestoreArticleVersionAsync(versionId, userId.Value);

            if (!success)
            {
                return StatusCode(500, new { message = "Failed to restore version" });
            }

            return Ok(new { message = "Version restored successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error restoring article version");
            return StatusCode(500, new { message = "An error occurred while restoring the version" });
        }
    }

    [HttpGet("{versionId}/compare/{compareVersionId}")]
    public async Task<ActionResult<VersionComparisonDto>> CompareVersions(
        int articleId, 
        int versionId, 
        int compareVersionId)
    {
        try
        {
            var oldVersion = await _versionRepository.GetArticleVersionByIdAsync(versionId);
            var newVersion = await _versionRepository.GetArticleVersionByIdAsync(compareVersionId);

            if (oldVersion == null || newVersion == null)
            {
                return NotFound(new { message = "One or both versions not found" });
            }

            if (oldVersion.ArticleId != articleId || newVersion.ArticleId != articleId)
            {
                return BadRequest(new { message = "Versions do not belong to this article" });
            }

            var comparison = new VersionComparisonDto
            {
                OldVersion = oldVersion,
                NewVersion = newVersion,
                Differences = new List<VersionDiffDto>()
            };

            // Compare fields
            if (oldVersion.Title != newVersion.Title)
            {
                comparison.Differences.Add(new VersionDiffDto
                {
                    Field = "Title",
                    OldValue = oldVersion.Title,
                    NewValue = newVersion.Title,
                    DiffType = "modified"
                });
            }

            if (oldVersion.Summary != newVersion.Summary)
            {
                comparison.Differences.Add(new VersionDiffDto
                {
                    Field = "Summary",
                    OldValue = oldVersion.Summary,
                    NewValue = newVersion.Summary,
                    DiffType = "modified"
                });
            }

            if (oldVersion.Content != newVersion.Content)
            {
                comparison.Differences.Add(new VersionDiffDto
                {
                    Field = "Content",
                    OldValue = oldVersion.Content,
                    NewValue = newVersion.Content,
                    DiffType = "modified"
                });
            }

            if (oldVersion.IsInternal != newVersion.IsInternal)
            {
                comparison.Differences.Add(new VersionDiffDto
                {
                    Field = "IsInternal",
                    OldValue = oldVersion.IsInternal.ToString(),
                    NewValue = newVersion.IsInternal.ToString(),
                    DiffType = "modified"
                });
            }

            return Ok(comparison);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error comparing versions");
            return StatusCode(500, new { message = "An error occurred while comparing versions" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
