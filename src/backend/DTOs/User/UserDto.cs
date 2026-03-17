namespace KnowledgeBase.API.DTOs.User
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{FirstName} {LastName}";
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int? TeamId { get; set; }
        public string? TeamName { get; set; }
        public int? ClientId { get; set; }
        public string? ClientName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
}
