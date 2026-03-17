using KnowledgeBase.API.Models;

namespace KnowledgeBase.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int userId);
        Task<User> CreateAsync(User user);
        Task<User> UpdateProfileAsync(int userId, string firstName, string lastName, int? teamId, int? clientId);
        Task<bool> ChangePasswordAsync(int userId, string newPasswordHash, string newPasswordSalt);
        Task UpdateLastLoginAsync(int userId);
        
        // Refresh Token operations
        Task<RefreshToken> CreateRefreshTokenAsync(int userId, string token, DateTime expiresAt);
        Task<RefreshToken?> ValidateRefreshTokenAsync(string token);
        Task<bool> RevokeRefreshTokenAsync(string token);
        
        // Lookup operations
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<IEnumerable<Team>> GetAllTeamsAsync();
        Task<IEnumerable<Client>> GetAllClientsAsync();
    }
}
