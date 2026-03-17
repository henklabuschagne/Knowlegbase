using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ArticleRequestController : ControllerBase
{
    private readonly IArticleRequestRepository _requestRepository;

    public ArticleRequestController(IArticleRequestRepository requestRepository)
    {
        _requestRepository = requestRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetRequests([FromQuery] ArticleRequestQueryParams queryParams)
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Regular users can only see their own requests
        if (userRole == "User")
        {
            queryParams.RequestedByUserId = userId;
        }

        var result = await _requestRepository.GetArticleRequestsAsync(queryParams);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRequest(int id)
    {
        var request = await _requestRepository.GetArticleRequestByIdAsync(id);
        
        if (request == null)
            return NotFound(new { message = "Request not found" });

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Regular users can only view their own requests
        if (userRole == "User" && request.RequestedByUserId != userId)
            return Forbid();

        return Ok(request);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateArticleRequestDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        var request = await _requestRepository.CreateArticleRequestAsync(dto, userId);
        return CreatedAtAction(nameof(GetRequest), new { id = request.RequestId }, request);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Support")]
    public async Task<IActionResult> UpdateRequest(int id, [FromBody] UpdateArticleRequestDto dto)
    {
        var request = await _requestRepository.UpdateArticleRequestAsync(id, dto);
        
        if (request == null)
            return NotFound(new { message = "Request not found" });

        return Ok(request);
    }

    [HttpPut("{id}/assign")]
    [Authorize(Roles = "Admin,Support")]
    public async Task<IActionResult> AssignRequest(int id, [FromBody] AssignRequestDto dto)
    {
        var updateDto = new UpdateArticleRequestDto
        {
            AssignedToUserId = dto.AssignedToUserId,
            StatusId = 2 // Under Review
        };

        var request = await _requestRepository.UpdateArticleRequestAsync(id, updateDto);
        
        if (request == null)
            return NotFound(new { message = "Request not found" });

        return Ok(request);
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin,Support")]
    public async Task<IActionResult> RejectRequest(int id, [FromBody] RejectRequestDto dto)
    {
        var updateDto = new UpdateArticleRequestDto
        {
            StatusId = 4, // Rejected
            RejectionReason = dto.Reason
        };

        var request = await _requestRepository.UpdateArticleRequestAsync(id, updateDto);
        
        if (request == null)
            return NotFound(new { message = "Request not found" });

        return Ok(request);
    }

    [HttpPut("{id}/complete")]
    [Authorize(Roles = "Admin,Support")]
    public async Task<IActionResult> CompleteRequest(int id, [FromBody] CompleteRequestDto dto)
    {
        var updateDto = new UpdateArticleRequestDto
        {
            StatusId = 5, // Completed
            ArticleId = dto.ArticleId
        };

        var request = await _requestRepository.UpdateArticleRequestAsync(id, updateDto);
        
        if (request == null)
            return NotFound(new { message = "Request not found" });

        return Ok(request);
    }
}

public class AssignRequestDto
{
    public int AssignedToUserId { get; set; }
}

public class RejectRequestDto
{
    public string Reason { get; set; } = string.Empty;
}

public class CompleteRequestDto
{
    public int ArticleId { get; set; }
}
