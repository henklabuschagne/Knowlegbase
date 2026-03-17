using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(
        IUserRepository userRepository,
        ILogger<SettingsController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    [HttpPost("ai-api-key")]
    public async Task<IActionResult> SaveAIApiKey([FromBody] SaveApiKeyRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var success = await _userRepository.SaveUserAIApiKeyAsync(userId.Value, request.ApiKey);
            
            if (success)
            {
                return Ok(new { message = "API key saved successfully" });
            }

            return BadRequest(new { message = "Failed to save API key" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving AI API key");
            return StatusCode(500, new { message = "An error occurred while saving the API key" });
        }
    }

    [HttpGet("ai-api-key")]
    public async Task<IActionResult> GetAIApiKey()
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var apiKey = await _userRepository.GetUserAIApiKeyAsync(userId.Value);
            
            if (string.IsNullOrEmpty(apiKey))
            {
                return Ok(new { hasKey = false });
            }

            // Return masked key for security
            var maskedKey = "sk-..." + apiKey.Substring(apiKey.Length - 4);
            return Ok(new { hasKey = true, maskedKey });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI API key");
            return StatusCode(500, new { message = "An error occurred while retrieving the API key" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}

public class SaveApiKeyRequest
{
    public string ApiKey { get; set; } = string.Empty;
}
