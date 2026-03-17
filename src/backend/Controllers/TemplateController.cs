using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TemplateController : ControllerBase
{
    private readonly ITemplateRepository _templateRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly ILogger<TemplateController> _logger;

    public TemplateController(
        ITemplateRepository templateRepository,
        IArticleRepository articleRepository,
        ILogger<TemplateController> logger)
    {
        _templateRepository = templateRepository;
        _articleRepository = articleRepository;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateArticleTemplateDto template)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var templateId = await _templateRepository.CreateTemplateAsync(template, userId.Value);
            return Ok(new { templateId, message = "Template created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating template");
            return StatusCode(500, new { message = "An error occurred while creating the template" });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<ArticleTemplateDto>>> GetTemplates(
        [FromQuery] string? category = null,
        [FromQuery] bool? isActive = true)
    {
        try
        {
            var templates = await _templateRepository.GetTemplatesAsync(category, isActive);
            return Ok(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting templates");
            return StatusCode(500, new { message = "An error occurred while retrieving templates" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ArticleTemplateDto>> GetTemplateById(int id)
    {
        try
        {
            var template = await _templateRepository.GetTemplateByIdAsync(id);
            if (template == null)
            {
                return NotFound(new { message = "Template not found" });
            }

            return Ok(template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting template {TemplateId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the template" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTemplate(int id, [FromBody] UpdateArticleTemplateDto template)
    {
        try
        {
            var success = await _templateRepository.UpdateTemplateAsync(id, template);
            if (!success)
            {
                return NotFound(new { message = "Template not found" });
            }

            return Ok(new { message = "Template updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating template {TemplateId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the template" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTemplate(int id)
    {
        try
        {
            var success = await _templateRepository.DeleteTemplateAsync(id);
            if (!success)
            {
                return NotFound(new { message = "Template not found" });
            }

            return Ok(new { message = "Template deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting template {TemplateId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the template" });
        }
    }

    [HttpPost("use/{id}")]
    public async Task<ActionResult<ArticleDto>> CreateArticleFromTemplate(
        int id,
        [FromBody] CreateArticleFromTemplateDto request)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            // Get template
            var template = await _templateRepository.GetTemplateByIdAsync(id);
            if (template == null)
            {
                return NotFound(new { message = "Template not found" });
            }

            // Render template with field values
            var content = template.ContentTemplate;
            var title = template.TitleTemplate ?? "";
            var summary = template.SummaryTemplate ?? "";

            foreach (var field in request.FieldValues)
            {
                content = content.Replace($"{{{{{field.Key}}}}}", field.Value);
                title = title.Replace($"{{{{{field.Key}}}}}", field.Value);
                summary = summary.Replace($"{{{{{field.Key}}}}}", field.Value);
            }

            // Create article
            var createArticleDto = new CreateArticleDto
            {
                Title = title,
                Content = content,
                Summary = summary,
                IsInternal = template.IsInternal
            };

            var articleId = await _articleRepository.CreateArticleAsync(createArticleDto, userId.Value);

            // Increment template usage
            await _templateRepository.IncrementTemplateUsageAsync(id);

            return Ok(new { articleId, message = "Article created from template successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating article from template {TemplateId}", id);
            return StatusCode(500, new { message = "An error occurred while creating article from template" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
