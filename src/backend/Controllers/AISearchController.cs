using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;
using KnowledgeBase.Services;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AISearchController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<AISearchController> _logger;

    public AISearchController(
        IAIService aiService,
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        ILogger<AISearchController> logger)
    {
        _aiService = aiService;
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpPost("search")]
    public async Task<ActionResult<AISearchResultDto>> SearchWithAI([FromBody] AISearchRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            // Get user's API key
            var apiKey = await _userRepository.GetUserAIApiKeyAsync(userId.Value);
            if (string.IsNullOrEmpty(apiKey))
            {
                return BadRequest(new { message = "Please configure your OpenAI API key in settings first." });
            }

            // Search for relevant articles
            var searchParams = new ArticleQueryParams
            {
                SearchQuery = request.Query,
                TagIds = request.TagIds,
                IsPublished = true,
                PageSize = 10
            };

            var articlesResult = await _articleRepository.SearchArticlesAsync(searchParams);
            
            if (!articlesResult.Data.Any())
            {
                return Ok(new AISearchResultDto
                {
                    Query = request.Query,
                    Answer = "I couldn't find any relevant articles in the knowledge base for your query. Please try rephrasing your question or contact support for assistance.",
                    RelevantArticles = new List<ArticleSummaryDto>(),
                    Timestamp = DateTime.UtcNow
                });
            }

            // Generate AI response
            var result = await _aiService.SearchWithAIAsync(request.Query, apiKey, articlesResult.Data);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AI search");
            return StatusCode(500, new { message = "An error occurred while processing your request." });
        }
    }

    [HttpPost("chat")]
    public async Task<ActionResult<AIChatResponseDto>> ChatWithAI([FromBody] AIChatRequestDto request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            // Get user's API key
            var apiKey = await _userRepository.GetUserAIApiKeyAsync(userId.Value);
            if (string.IsNullOrEmpty(apiKey))
            {
                return BadRequest(new { message = "Please configure your OpenAI API key in settings first." });
            }

            // Search for relevant articles based on the current message
            var searchParams = new ArticleQueryParams
            {
                SearchQuery = request.Message,
                TagIds = request.TagIds,
                IsPublished = true,
                PageSize = 10
            };

            var articlesResult = await _articleRepository.SearchArticlesAsync(searchParams);

            // Build conversation history string
            var conversationHistory = string.Join("\n", 
                request.ConversationHistory.Select(m => 
                    $"{(m.Role == "user" ? "User" : "Assistant")}: {m.Content}"));

            // Generate AI response
            var answer = await _aiService.GenerateAnswerAsync(
                request.Message, 
                conversationHistory, 
                apiKey, 
                articlesResult.Data);

            return Ok(new AIChatResponseDto
            {
                Response = answer,
                RelevantArticles = articlesResult.Data.Select(a => new ArticleSummaryDto
                {
                    ArticleId = a.ArticleId,
                    Title = a.Title,
                    Summary = a.Summary
                }).ToList(),
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AI chat");
            return StatusCode(500, new { message = "An error occurred while processing your request." });
        }
    }

    [HttpPost("validate-key")]
    public async Task<ActionResult<bool>> ValidateApiKey([FromBody] ValidateApiKeyDto request)
    {
        try
        {
            var isValid = await _aiService.ValidateApiKeyAsync(request.ApiKey);
            return Ok(new { isValid });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating API key");
            return Ok(new { isValid = false });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}

public class ValidateApiKeyDto
{
    public string ApiKey { get; set; } = string.Empty;
}
