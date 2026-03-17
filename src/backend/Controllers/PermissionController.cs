using Microsoft.AspNetCore.Mvc;
using KnowledgeBase.DTOs;
using KnowledgeBase.Repositories;

namespace KnowledgeBase.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PermissionController : ControllerBase
{
    private readonly IPermissionRepository _permissionRepository;
    private readonly ILogger<PermissionController> _logger;

    public PermissionController(
        IPermissionRepository permissionRepository,
        ILogger<PermissionController> logger)
    {
        _permissionRepository = permissionRepository;
        _logger = logger;
    }

    // Team Management
    [HttpPost("teams")]
    public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto team)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var teamId = await _permissionRepository.CreateTeamAsync(team, userId.Value);
            return Ok(new { teamId, message = "Team created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating team");
            return StatusCode(500, new { message = "An error occurred while creating the team" });
        }
    }

    [HttpGet("teams")]
    public async Task<ActionResult<List<TeamDto>>> GetTeams([FromQuery] bool? isActive = true)
    {
        try
        {
            var teams = await _permissionRepository.GetTeamsAsync(isActive);
            return Ok(teams);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting teams");
            return StatusCode(500, new { message = "An error occurred while retrieving teams" });
        }
    }

    [HttpPost("teams/{teamId}/members")]
    public async Task<IActionResult> AddTeamMember(int teamId, [FromBody] AddTeamMemberDto member)
    {
        try
        {
            var memberId = await _permissionRepository.AddTeamMemberAsync(teamId, member);
            return Ok(new { memberId, message = "Team member added successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding team member");
            return StatusCode(500, new { message = "An error occurred while adding the team member" });
        }
    }

    // Custom Role Management
    [HttpPost("roles")]
    public async Task<IActionResult> CreateCustomRole([FromBody] CreateCustomRoleDto role)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var roleId = await _permissionRepository.CreateCustomRoleAsync(role, userId.Value);
            return Ok(new { roleId, message = "Custom role created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating custom role");
            return StatusCode(500, new { message = "An error occurred while creating the custom role" });
        }
    }

    [HttpGet("roles")]
    public async Task<ActionResult<List<CustomRoleDto>>> GetCustomRoles([FromQuery] bool? isActive = true)
    {
        try
        {
            var roles = await _permissionRepository.GetCustomRolesAsync(isActive);
            return Ok(roles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting custom roles");
            return StatusCode(500, new { message = "An error occurred while retrieving custom roles" });
        }
    }

    [HttpPost("roles/{roleId}/permissions")]
    public async Task<IActionResult> AddRolePermission(int roleId, [FromBody] CreateRolePermissionDto permission)
    {
        try
        {
            var permissionId = await _permissionRepository.AddRolePermissionAsync(roleId, permission);
            return Ok(new { permissionId, message = "Permission added successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding role permission");
            return StatusCode(500, new { message = "An error occurred while adding the permission" });
        }
    }

    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRoleToUser([FromBody] AssignRoleDto assignment)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var success = await _permissionRepository.AssignRoleToUserAsync(assignment, userId.Value);
            if (!success)
            {
                return BadRequest(new { message = "Failed to assign role" });
            }

            return Ok(new { message = "Role assigned successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning role");
            return StatusCode(500, new { message = "An error occurred while assigning the role" });
        }
    }

    [HttpGet("check")]
    public async Task<ActionResult<PermissionCheckDto>> CheckPermission(
        [FromQuery] string resource,
        [FromQuery] string action,
        [FromQuery] int? entityId = null)
    {
        try
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized();
            }

            var result = await _permissionRepository.CheckUserPermissionAsync(
                userId.Value, resource, action, entityId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking permission");
            return StatusCode(500, new { message = "An error occurred while checking permission" });
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = User.FindFirst("UserId")?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }
}
