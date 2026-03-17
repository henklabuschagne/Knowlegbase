namespace KnowledgeBase.API.Models
{
    public class Client
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
