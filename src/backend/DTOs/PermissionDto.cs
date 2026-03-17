namespace KnowledgeBase.DTOs;

public class TeamDto
{
    public int TeamId { get; set; }
    public string TeamName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int MemberCount { get; set; }
}

public class CreateTeamDto
{
    public string TeamName { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class TeamMemberDto
{
    public int TeamMemberId { get; set; }
    public int TeamId { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string TeamRole { get; set; } = "Member";
    public DateTime JoinedAt { get; set; }
}

public class AddTeamMemberDto
{
    public int UserId { get; set; }
    public string TeamRole { get; set; } = "Member";
}

public class CustomRoleDto
{
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<RolePermissionDto> Permissions { get; set; } = new();
}

public class CreateCustomRoleDto
{
    public string RoleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<CreateRolePermissionDto> Permissions { get; set; } = new();
}

public class RolePermissionDto
{
    public int PermissionId { get; set; }
    public int RoleId { get; set; }
    public string Resource { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Scope { get; set; } = "All";
    public string? Conditions { get; set; }
}

public class CreateRolePermissionDto
{
    public string Resource { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Scope { get; set; } = "All";
    public string? Conditions { get; set; }
}

public class ArticlePermissionDto
{
    public int PermissionId { get; set; }
    public int ArticleId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string PermissionLevel { get; set; } = string.Empty;
    public int GrantedBy { get; set; }
    public DateTime GrantedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class GrantArticlePermissionDto
{
    public int ArticleId { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string PermissionLevel { get; set; } = string.Empty;
    public DateTime? ExpiresAt { get; set; }
}

public class AssignRoleDto
{
    public int UserId { get; set; }
    public int RoleId { get; set; }
    public DateTime? ExpiresAt { get; set; }
}

public class PermissionCheckDto
{
    public bool HasPermission { get; set; }
    public string? Scope { get; set; }
    public string? Reason { get; set; }
}
