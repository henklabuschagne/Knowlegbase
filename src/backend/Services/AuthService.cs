using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using KnowledgeBase.API.DTOs.Auth;
using KnowledgeBase.API.Models;
using KnowledgeBase.API.Repositories;

namespace KnowledgeBase.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("Email already exists");
            }

            // Hash password
            var (passwordHash, passwordSalt) = HashPassword(request.Password);

            // Create user
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                FirstName = request.FirstName,
                LastName = request.LastName,
                RoleId = request.RoleId,
                TeamId = request.TeamId,
                ClientId = request.ClientId
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // Get full user details
            var userDetails = await _userRepository.GetByIdAsync(createdUser.UserId);
            if (userDetails == null)
            {
                throw new InvalidOperationException("Failed to retrieve created user");
            }

            // Generate tokens
            var accessToken = GenerateAccessToken(userDetails);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddDays(7);

            // Save refresh token
            await _userRepository.CreateRefreshTokenAsync(userDetails.UserId, refreshToken, expiresAt);

            return new AuthResponseDto
            {
                UserId = userDetails.UserId,
                Email = userDetails.Email,
                FirstName = userDetails.FirstName,
                LastName = userDetails.LastName,
                RoleId = userDetails.RoleId,
                RoleName = userDetails.RoleName ?? string.Empty,
                TeamId = userDetails.TeamId,
                TeamName = userDetails.TeamName,
                ClientId = userDetails.ClientId,
                ClientName = userDetails.ClientName,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            // Get user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Verify password
            if (!VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Update last login
            await _userRepository.UpdateLastLoginAsync(user.UserId);

            // Generate tokens
            var accessToken = GenerateAccessToken(user);
            var refreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddDays(7);

            // Save refresh token
            await _userRepository.CreateRefreshTokenAsync(user.UserId, refreshToken, expiresAt);

            return new AuthResponseDto
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
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            // Validate refresh token
            var tokenData = await _userRepository.ValidateRefreshTokenAsync(refreshToken);
            if (tokenData == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }

            // Get user details
            var user = await _userRepository.GetByIdAsync(tokenData.UserId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            // Revoke old refresh token
            await _userRepository.RevokeRefreshTokenAsync(refreshToken);

            // Generate new tokens
            var accessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();
            var expiresAt = DateTime.UtcNow.AddDays(7);

            // Save new refresh token
            await _userRepository.CreateRefreshTokenAsync(user.UserId, newRefreshToken, expiresAt);

            return new AuthResponseDto
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
                AccessToken = accessToken,
                RefreshToken = newRefreshToken,
                ExpiresAt = expiresAt
            };
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            return await _userRepository.RevokeRefreshTokenAsync(refreshToken);
        }

        private string GenerateAccessToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.RoleName ?? string.Empty),
                new Claim("RoleId", user.RoleId.ToString()),
                new Claim("TeamId", user.TeamId?.ToString() ?? string.Empty),
                new Claim("ClientId", user.ClientId?.ToString() ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private (string hash, string salt) HashPassword(string password)
        {
            // Generate salt
            var saltBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(saltBytes);
            var salt = Convert.ToBase64String(saltBytes);

            // Hash password with salt
            using var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256);
            var hash = Convert.ToBase64String(pbkdf2.GetBytes(32));

            return (hash, salt);
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            var saltBytes = Convert.FromBase64String(storedSalt);
            using var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256);
            var hash = Convert.ToBase64String(pbkdf2.GetBytes(32));

            return hash == storedHash;
        }
    }
}
