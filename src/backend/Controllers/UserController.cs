using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using KnowledgeBase.API.DTOs.User;
using KnowledgeBase.API.DTOs.Common;
using KnowledgeBase.API.Repositories;
using KnowledgeBase.API.Services;

namespace KnowledgeBase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        private readonly ILogger<UserController> _logger;

        public UserController(
            IUserRepository userRepository,
            IAuthService authService,
            ILogger<UserController> logger)
        {
            _userRepository = userRepository;
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        [HttpGet("profile")]
        public async Task<ActionResult<UserDto>> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userDto = new UserDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    RoleId = user.RoleId,
                    RoleName = user.RoleName ?? string.Empty,
                    TeamId = user.TeamId,
                    TeamName = user.TeamName,
                    ClientId = user.ClientId,
                    ClientName = user.ClientName,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    LastLoginAt = user.LastLoginAt
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user profile");
                return StatusCode(500, new { message = "An error occurred while retrieving profile" });
            }
        }

        /// <summary>
        /// Update current user profile
        /// </summary>
        [HttpPut("profile")]
        public async Task<ActionResult<UserDto>> UpdateProfile([FromBody] UpdateProfileRequestDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updatedUser = await _userRepository.UpdateProfileAsync(
                    userId,
                    request.FirstName,
                    request.LastName,
                    request.TeamId,
                    request.ClientId
                );

                var userDto = new UserDto
                {
                    UserId = updatedUser.UserId,
                    Email = updatedUser.Email,
                    FirstName = updatedUser.FirstName,
                    LastName = updatedUser.LastName,
                    RoleId = updatedUser.RoleId,
                    RoleName = updatedUser.RoleName ?? string.Empty,
                    TeamId = updatedUser.TeamId,
                    TeamName = updatedUser.TeamName,
                    ClientId = updatedUser.ClientId,
                    ClientName = updatedUser.ClientName,
                    IsActive = updatedUser.IsActive,
                    CreatedAt = updatedUser.CreatedAt,
                    UpdatedAt = updatedUser.UpdatedAt,
                    LastLoginAt = updatedUser.LastLoginAt
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user profile");
                return StatusCode(500, new { message = "An error occurred while updating profile" });
            }
        }

        /// <summary>
        /// Change password
        /// </summary>
        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var user = await _userRepository.GetByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Verify current password
                if (!VerifyPassword(request.CurrentPassword, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest(new { message = "Current password is incorrect" });
                }

                // Hash new password
                var (newHash, newSalt) = HashPassword(request.NewPassword);

                // Update password
                var success = await _userRepository.ChangePasswordAsync(userId, newHash, newSalt);

                if (success)
                {
                    return Ok(new { message = "Password changed successfully" });
                }

                return BadRequest(new { message = "Failed to change password" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error changing password");
                return StatusCode(500, new { message = "An error occurred while changing password" });
            }
        }

        /// <summary>
        /// Get all roles (for admin/support users)
        /// </summary>
        [HttpGet("roles")]
        [Authorize(Roles = "Admin,Support")]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            try
            {
                var roles = await _userRepository.GetAllRolesAsync();
                var roleDtos = roles.Select(r => new RoleDto
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description,
                    IsActive = r.IsActive
                });

                return Ok(roleDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving roles");
                return StatusCode(500, new { message = "An error occurred while retrieving roles" });
            }
        }

        /// <summary>
        /// Get all teams
        /// </summary>
        [HttpGet("teams")]
        public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeams()
        {
            try
            {
                var teams = await _userRepository.GetAllTeamsAsync();
                var teamDtos = teams.Select(t => new TeamDto
                {
                    TeamId = t.TeamId,
                    TeamName = t.TeamName,
                    Description = t.Description,
                    IsActive = t.IsActive
                });

                return Ok(teamDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teams");
                return StatusCode(500, new { message = "An error occurred while retrieving teams" });
            }
        }

        /// <summary>
        /// Get all clients
        /// </summary>
        [HttpGet("clients")]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients()
        {
            try
            {
                var clients = await _userRepository.GetAllClientsAsync();
                var clientDtos = clients.Select(c => new ClientDto
                {
                    ClientId = c.ClientId,
                    ClientName = c.ClientName,
                    Description = c.Description,
                    IsActive = c.IsActive
                });

                return Ok(clientDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving clients");
                return StatusCode(500, new { message = "An error occurred while retrieving clients" });
            }
        }

        // Helper methods
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }

            return userId;
        }

        private (string hash, string salt) HashPassword(string password)
        {
            var saltBytes = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(saltBytes);
            var salt = Convert.ToBase64String(saltBytes);

            using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(
                password, saltBytes, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
            var hash = Convert.ToBase64String(pbkdf2.GetBytes(32));

            return (hash, salt);
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            var saltBytes = Convert.FromBase64String(storedSalt);
            using var pbkdf2 = new System.Security.Cryptography.Rfc2898DeriveBytes(
                password, saltBytes, 10000, System.Security.Cryptography.HashAlgorithmName.SHA256);
            var hash = Convert.ToBase64String(pbkdf2.GetBytes(32));

            return hash == storedHash;
        }
    }
}
