using System.ComponentModel.DataAnnotations;

namespace KnowledgeBase.API.DTOs.User
{
    public class UpdateProfileRequestDto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
        public string LastName { get; set; } = string.Empty;

        public int? TeamId { get; set; }

        public int? ClientId { get; set; }
    }
}
