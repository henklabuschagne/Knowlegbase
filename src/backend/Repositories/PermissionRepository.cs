using System.Data;
using System.Data.SqlClient;
using Dapper;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Repositories;

public interface IPermissionRepository
{
    Task<int> CreateTeamAsync(CreateTeamDto team, int createdBy);
    Task<List<TeamDto>> GetTeamsAsync(bool? isActive = true);
    Task<int> AddTeamMemberAsync(int teamId, AddTeamMemberDto member);
    Task<int> CreateCustomRoleAsync(CreateCustomRoleDto role, int createdBy);
    Task<List<CustomRoleDto>> GetCustomRolesAsync(bool? isActive = true);
    Task<int> AddRolePermissionAsync(int roleId, CreateRolePermissionDto permission);
    Task<bool> AssignRoleToUserAsync(AssignRoleDto assignment, int assignedBy);
    Task<PermissionCheckDto> CheckUserPermissionAsync(int userId, string resource, string action, int? entityId = null);
}

public class PermissionRepository : IPermissionRepository
{
    private readonly string _connectionString;

    public PermissionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
    }

    public async Task<int> CreateTeamAsync(CreateTeamDto team, int createdBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            team.TeamName,
            team.Description,
            CreatedBy = createdBy
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_CreateTeam",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.TeamId ?? 0;
    }

    public async Task<List<TeamDto>> GetTeamsAsync(bool? isActive = true)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new { IsActive = isActive };

        var teams = await connection.QueryAsync<TeamDto>(
            "sp_GetTeams",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return teams.ToList();
    }

    public async Task<int> AddTeamMemberAsync(int teamId, AddTeamMemberDto member)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            TeamId = teamId,
            member.UserId,
            member.TeamRole
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_AddTeamMember",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.TeamMemberId ?? 0;
    }

    public async Task<int> CreateCustomRoleAsync(CreateCustomRoleDto role, int createdBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            role.RoleName,
            role.Description,
            CreatedBy = createdBy
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_CreateCustomRole",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var roleId = result?.RoleId ?? 0;

        // Add permissions
        if (role.Permissions != null && role.Permissions.Any())
        {
            foreach (var permission in role.Permissions)
            {
                await AddRolePermissionAsync(roleId, permission);
            }
        }

        return roleId;
    }

    public async Task<List<CustomRoleDto>> GetCustomRolesAsync(bool? isActive = true)
    {
        using var connection = new SqlConnection(_connectionString);

        var sql = @"
            SELECT 
                cr.RoleId,
                cr.RoleName,
                cr.Description,
                cr.IsActive,
                cr.CreatedBy,
                u.FirstName + ' ' + u.LastName AS CreatedByName,
                cr.CreatedAt,
                cr.UpdatedAt
            FROM CustomRoles cr
            INNER JOIN Users u ON cr.CreatedBy = u.UserId
            WHERE (@IsActive IS NULL OR cr.IsActive = @IsActive)
            ORDER BY cr.RoleName ASC";

        var roles = await connection.QueryAsync<CustomRoleDto>(sql, new { IsActive = isActive });

        // Get permissions for each role
        foreach (var role in roles)
        {
            var permissionsSql = @"
                SELECT 
                    PermissionId,
                    RoleId,
                    Resource,
                    Action,
                    Scope,
                    Conditions
                FROM RolePermissions
                WHERE RoleId = @RoleId";

            role.Permissions = (await connection.QueryAsync<RolePermissionDto>(
                permissionsSql,
                new { RoleId = role.RoleId }
            )).ToList();
        }

        return roles.ToList();
    }

    public async Task<int> AddRolePermissionAsync(int roleId, CreateRolePermissionDto permission)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            RoleId = roleId,
            permission.Resource,
            permission.Action,
            permission.Scope,
            permission.Conditions
        };

        var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "sp_AddRolePermission",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result?.PermissionId ?? 0;
    }

    public async Task<bool> AssignRoleToUserAsync(AssignRoleDto assignment, int assignedBy)
    {
        using var connection = new SqlConnection(_connectionString);

        var sql = @"
            INSERT INTO UserCustomRoles (UserId, RoleId, AssignedBy, AssignedAt, ExpiresAt)
            VALUES (@UserId, @RoleId, @AssignedBy, GETUTCDATE(), @ExpiresAt)";

        var rowsAffected = await connection.ExecuteAsync(sql, new
        {
            assignment.UserId,
            assignment.RoleId,
            AssignedBy = assignedBy,
            assignment.ExpiresAt
        });

        return rowsAffected > 0;
    }

    public async Task<PermissionCheckDto> CheckUserPermissionAsync(
        int userId, string resource, string action, int? entityId = null)
    {
        using var connection = new SqlConnection(_connectionString);

        var parameters = new
        {
            UserId = userId,
            Resource = resource,
            Action = action,
            EntityId = entityId
        };

        using var multi = await connection.QueryMultipleAsync(
            "sp_CheckUserPermission",
            parameters,
            commandType: CommandType.StoredProcedure
        );

        var rolePermission = await multi.ReadFirstOrDefaultAsync<RolePermissionDto>();
        var articlePermission = await multi.ReadFirstOrDefaultAsync<ArticlePermissionDto>();

        if (rolePermission != null || articlePermission != null)
        {
            return new PermissionCheckDto
            {
                HasPermission = true,
                Scope = rolePermission?.Scope ?? articlePermission?.PermissionLevel,
                Reason = rolePermission != null ? "Role permission" : "Article permission"
            };
        }

        return new PermissionCheckDto
        {
            HasPermission = false,
            Reason = "No permission found"
        };
    }
}
