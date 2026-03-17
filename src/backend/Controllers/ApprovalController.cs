using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Support")]
public class ApprovalController : ControllerBase
{
    private readonly IApprovalRepository _approvalRepository;

    public ApprovalController(IApprovalRepository approvalRepository)
    {
        _approvalRepository = approvalRepository;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingApprovals([FromQuery] ApprovalQueryParams queryParams)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var result = await _approvalRepository.GetPendingApprovalsAsync(userId, queryParams);
        return Ok(result);
    }

    [HttpPost("submit")]
    public async Task<IActionResult> SubmitForApproval([FromBody] SubmitApprovalDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        try
        {
            var approvalId = await _approvalRepository.SubmitForApprovalAsync(dto, userId);
            return Ok(new { approvalId, message = "Article submitted for approval" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveArticle(int id, [FromBody] ReviewApprovalDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        try
        {
            await _approvalRepository.ApproveAsync(id, userId, dto.Comments);
            return Ok(new { message = "Article approved successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> RejectArticle(int id, [FromBody] ReviewApprovalDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Comments))
            return BadRequest(new { message = "Comments are required when rejecting an article" });

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        try
        {
            await _approvalRepository.RejectAsync(id, userId, dto.Comments);
            return Ok(new { message = "Article rejected" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
