using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.API.DTOs.Article;
using KnowledgeBase.API.DTOs.Common;
using KnowledgeBase.API.DTOs.Tag;
using KnowledgeBase.API.Repositories;
using System.Security.Claims;

namespace KnowledgeBase.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ArticleController : ControllerBase
{
    private readonly IArticleRepository _articleRepository;
    private readonly ILogger<ArticleController> _logger;

    public ArticleController(IArticleRepository articleRepository, ILogger<ArticleController> logger)
    {
        _articleRepository = articleRepository;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    private string? GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value;
    }

    /// <summary>
    /// Get all articles with filtering and pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<ArticleListDto>>> GetAllArticles(
        [FromQuery] int? userId = null,
        [FromQuery] bool? isInternal = null,
        [FromQuery] int? statusId = null,
        [FromQuery] bool? isPublished = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var role = GetCurrentUserRole();
            
            // Regular users can only see published articles
            if (role == "User")
            {
                isPublished = true;
                statusId = 4; // Published
            }

            var (articles, totalCount) = await _articleRepository.GetAllArticlesAsync(
                userId,
                isInternal,
                statusId,
                isPublished,
                searchTerm,
                pageNumber,
                pageSize
            );

            var articleDtos = articles.Select(a => new ArticleListDto
            {
                ArticleId = a.ArticleId,
                Title = a.Title,
                Summary = a.Summary,
                CreatedBy = a.CreatedBy,
                CreatedByName = a.CreatedByName,
                UpdatedBy = a.UpdatedBy,
                UpdatedByName = a.UpdatedByName,
                ApprovedBy = a.ApprovedBy,
                ApprovedByName = a.ApprovedByName,
                StatusId = a.StatusId,
                StatusName = a.StatusName,
                IsPublished = a.IsPublished,
                IsInternal = a.IsInternal,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                PublishedAt = a.PublishedAt,
                ApprovedAt = a.ApprovedAt,
                VersionNumber = a.VersionNumber,
                ParentArticleId = a.ParentArticleId,
                ViewCount = a.ViewCount
            }).ToList();

            var result = new PagedResultDto<ArticleListDto>
            {
                Data = articleDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting articles");
            return StatusCode(500, new { message = "An error occurred while retrieving articles" });
        }
    }

    /// <summary>
    /// Get article by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ArticleDto>> GetArticleById(int id)
    {
        try
        {
            var article = await _articleRepository.GetArticleByIdAsync(id);
            if (article == null)
            {
                return NotFound(new { message = "Article not found" });
            }

            var role = GetCurrentUserRole();
            
            // Regular users can only see published articles
            if (role == "User" && (!article.IsPublished || article.StatusId != 4))
            {
                return NotFound(new { message = "Article not found" });
            }

            // Get article tags
            var tags = await _articleRepository.GetArticleTagsAsync(id);

            var articleDto = new ArticleDto
            {
                ArticleId = article.ArticleId,
                Title = article.Title,
                Summary = article.Summary,
                Content = article.Content,
                CreatedBy = article.CreatedBy,
                CreatedByName = article.CreatedByName,
                CreatedByEmail = article.CreatedByEmail,
                UpdatedBy = article.UpdatedBy,
                UpdatedByName = article.UpdatedByName,
                ApprovedBy = article.ApprovedBy,
                ApprovedByName = article.ApprovedByName,
                StatusId = article.StatusId,
                StatusName = article.StatusName,
                IsPublished = article.IsPublished,
                IsInternal = article.IsInternal,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                PublishedAt = article.PublishedAt,
                ApprovedAt = article.ApprovedAt,
                VersionNumber = article.VersionNumber,
                ParentArticleId = article.ParentArticleId,
                ViewCount = article.ViewCount,
                Tags = tags.Select(t => new TagDto
                {
                    TagId = t.TagId,
                    TagTypeId = t.TagTypeId,
                    TagTypeName = t.TagTypeName,
                    TagName = t.TagName,
                    TagValue = t.TagValue,
                    ColorCode = t.ColorCode
                }).ToList()
            };

            // Increment view count (fire and forget)
            _ = Task.Run(async () =>
            {
                try
                {
                    await _articleRepository.IncrementViewCountAsync(id);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to increment view count for article {ArticleId}", id);
                }
            });

            return Ok(articleDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article {ArticleId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the article" });
        }
    }

    /// <summary>
    /// Create a new article (Admin and Support only)
    /// </summary>
    [Authorize(Roles = "Admin,Support")]
    [HttpPost]
    public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] CreateArticleRequestDto request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "User ID not found" });
            }

            var article = await _articleRepository.CreateArticleAsync(
                request.Title,
                request.Summary,
                request.Content,
                userId,
                request.StatusId,
                request.IsInternal,
                request.TagIds
            );

            // Get full article with tags
            var tags = await _articleRepository.GetArticleTagsAsync(article.ArticleId);

            var articleDto = new ArticleDto
            {
                ArticleId = article.ArticleId,
                Title = article.Title,
                Summary = article.Summary,
                Content = article.Content,
                CreatedBy = article.CreatedBy,
                CreatedByName = article.CreatedByName,
                CreatedByEmail = article.CreatedByEmail,
                UpdatedBy = article.UpdatedBy,
                UpdatedByName = article.UpdatedByName,
                StatusId = article.StatusId,
                StatusName = article.StatusName,
                IsPublished = article.IsPublished,
                IsInternal = article.IsInternal,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                VersionNumber = article.VersionNumber,
                ViewCount = article.ViewCount,
                Tags = tags.Select(t => new TagDto
                {
                    TagId = t.TagId,
                    TagTypeId = t.TagTypeId,
                    TagTypeName = t.TagTypeName,
                    TagName = t.TagName,
                    TagValue = t.TagValue,
                    ColorCode = t.ColorCode
                }).ToList()
            };

            return CreatedAtAction(nameof(GetArticleById), new { id = article.ArticleId }, articleDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating article");
            return StatusCode(500, new { message = "An error occurred while creating the article" });
        }
    }

    /// <summary>
    /// Update an existing article (Admin and Support only)
    /// </summary>
    [Authorize(Roles = "Admin,Support")]
    [HttpPut("{id}")]
    public async Task<ActionResult<ArticleDto>> UpdateArticle(int id, [FromBody] UpdateArticleRequestDto request)
    {
        try
        {
            var existingArticle = await _articleRepository.GetArticleByIdAsync(id);
            if (existingArticle == null)
            {
                return NotFound(new { message = "Article not found" });
            }

            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "User ID not found" });
            }

            var article = await _articleRepository.UpdateArticleAsync(
                id,
                request.Title,
                request.Summary,
                request.Content,
                userId,
                request.StatusId,
                request.IsInternal,
                request.TagIds
            );

            // Get article tags
            var tags = await _articleRepository.GetArticleTagsAsync(id);

            var articleDto = new ArticleDto
            {
                ArticleId = article.ArticleId,
                Title = article.Title,
                Summary = article.Summary,
                Content = article.Content,
                CreatedBy = article.CreatedBy,
                CreatedByName = article.CreatedByName,
                CreatedByEmail = article.CreatedByEmail,
                UpdatedBy = article.UpdatedBy,
                UpdatedByName = article.UpdatedByName,
                ApprovedBy = article.ApprovedBy,
                ApprovedByName = article.ApprovedByName,
                StatusId = article.StatusId,
                StatusName = article.StatusName,
                IsPublished = article.IsPublished,
                IsInternal = article.IsInternal,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                PublishedAt = article.PublishedAt,
                ApprovedAt = article.ApprovedAt,
                VersionNumber = article.VersionNumber,
                ParentArticleId = article.ParentArticleId,
                ViewCount = article.ViewCount,
                Tags = tags.Select(t => new TagDto
                {
                    TagId = t.TagId,
                    TagTypeId = t.TagTypeId,
                    TagTypeName = t.TagTypeName,
                    TagName = t.TagName,
                    TagValue = t.TagValue,
                    ColorCode = t.ColorCode
                }).ToList()
            };

            return Ok(articleDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating article {ArticleId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the article" });
        }
    }

    /// <summary>
    /// Delete an article (Admin only, soft delete - archives the article)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteArticle(int id)
    {
        try
        {
            var existingArticle = await _articleRepository.GetArticleByIdAsync(id);
            if (existingArticle == null)
            {
                return NotFound(new { message = "Article not found" });
            }

            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "User ID not found" });
            }

            await _articleRepository.DeleteArticleAsync(id, userId);
            return Ok(new { message = "Article archived successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting article {ArticleId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the article" });
        }
    }

    /// <summary>
    /// Publish an article (Admin only)
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost("{id}/publish")]
    public async Task<ActionResult> PublishArticle(int id)
    {
        try
        {
            var existingArticle = await _articleRepository.GetArticleByIdAsync(id);
            if (existingArticle == null)
            {
                return NotFound(new { message = "Article not found" });
            }

            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized(new { message = "User ID not found" });
            }

            await _articleRepository.PublishArticleAsync(id, userId);
            return Ok(new { message = "Article published successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing article {ArticleId}", id);
            return StatusCode(500, new { message = "An error occurred while publishing the article" });
        }
    }

    /// <summary>
    /// Search articles by tags
    /// </summary>
    [HttpPost("search")]
    public async Task<ActionResult<PagedResultDto<ArticleListDto>>> SearchByTags(
        [FromBody] List<int> tagIds,
        [FromQuery] bool? isInternal = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (tagIds == null || !tagIds.Any())
            {
                return BadRequest(new { message = "At least one tag ID is required" });
            }

            var role = GetCurrentUserRole();
            bool? isPublished = role == "User" ? true : null;

            var (articles, totalCount) = await _articleRepository.SearchArticlesByTagsAsync(
                tagIds,
                isPublished,
                isInternal,
                pageNumber,
                pageSize
            );

            var articleDtos = articles.Select(a => new ArticleListDto
            {
                ArticleId = a.ArticleId,
                Title = a.Title,
                Summary = a.Summary,
                CreatedBy = a.CreatedBy,
                CreatedByName = a.CreatedByName,
                StatusId = a.StatusId,
                StatusName = a.StatusName,
                IsPublished = a.IsPublished,
                IsInternal = a.IsInternal,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                PublishedAt = a.PublishedAt,
                VersionNumber = a.VersionNumber,
                ViewCount = a.ViewCount,
                MatchingTags = a.MatchingTags
            }).ToList();

            var result = new PagedResultDto<ArticleListDto>
            {
                Data = articleDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching articles by tags");
            return StatusCode(500, new { message = "An error occurred while searching articles" });
        }
    }

    /// <summary>
    /// Get all article statuses
    /// </summary>
    [HttpGet("statuses")]
    public async Task<ActionResult<IEnumerable<ArticleStatusDto>>> GetAllStatuses()
    {
        try
        {
            var statuses = await _articleRepository.GetAllArticleStatusesAsync();
            var statusDtos = statuses.Select(s => new ArticleStatusDto
            {
                StatusId = s.StatusId,
                StatusName = s.StatusName,
                Description = s.Description,
                IsActive = s.IsActive
            });

            return Ok(statusDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting article statuses");
            return StatusCode(500, new { message = "An error occurred while retrieving article statuses" });
        }
    }
}
