using System.Text;
using System.Text.Json;
using KnowledgeBase.DTOs;

namespace KnowledgeBase.Services;

public interface IAIService
{
    Task<AISearchResultDto> SearchWithAIAsync(string query, string apiKey, List<ArticleListDto> relevantArticles);
    Task<string> GenerateAnswerAsync(string query, string conversationHistory, string apiKey, List<ArticleListDto> relevantArticles);
    Task<bool> ValidateApiKeyAsync(string apiKey);
}

public class AIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIService> _logger;
    private const string OpenAIBaseUrl = "https://api.openai.com/v1";

    public AIService(HttpClient httpClient, ILogger<AIService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<AISearchResultDto> SearchWithAIAsync(string query, string apiKey, List<ArticleListDto> relevantArticles)
    {
        try
        {
            var context = BuildContext(relevantArticles);
            var systemPrompt = @"You are a helpful AI assistant for a knowledge base system. 
Your role is to help users find information from the knowledge base articles provided.
When answering:
1. Use only information from the provided articles
2. Cite the article titles when referencing information
3. If the answer is not in the provided articles, say so clearly
4. Be concise but thorough
5. Format your response in a clear, readable way";

            var userPrompt = $@"Based on the following knowledge base articles, answer this question: {query}

Available Articles:
{context}

Please provide a comprehensive answer based on the articles above.";

            var response = await CallOpenAIAsync(apiKey, systemPrompt, userPrompt);

            return new AISearchResultDto
            {
                Query = query,
                Answer = response,
                RelevantArticles = relevantArticles.Select(a => new ArticleSummaryDto
                {
                    ArticleId = a.ArticleId,
                    Title = a.Title,
                    Summary = a.Summary
                }).ToList(),
                Timestamp = DateTime.UtcNow
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error performing AI search");
            throw;
        }
    }

    public async Task<string> GenerateAnswerAsync(string query, string conversationHistory, string apiKey, List<ArticleListDto> relevantArticles)
    {
        try
        {
            var context = BuildContext(relevantArticles);
            var systemPrompt = @"You are a helpful AI assistant for a knowledge base system. 
You're having a conversation with a user to help them find information.
Use the provided knowledge base articles to answer their questions.
Maintain context from the conversation history.
Be conversational and helpful.";

            var userPrompt = $@"Conversation History:
{conversationHistory}

Available Knowledge Base Articles:
{context}

User's Current Question: {query}

Please provide a helpful response based on the articles and conversation context.";

            return await CallOpenAIAsync(apiKey, systemPrompt, userPrompt);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating AI answer");
            throw;
        }
    }

    public async Task<bool> ValidateApiKeyAsync(string apiKey)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"{OpenAIBaseUrl}/models");
            request.Headers.Add("Authorization", $"Bearer {apiKey}");

            var response = await _httpClient.SendAsync(request);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating API key");
            return false;
        }
    }

    private async Task<string> CallOpenAIAsync(string apiKey, string systemPrompt, string userPrompt)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{OpenAIBaseUrl}/chat/completions");
        request.Headers.Add("Authorization", $"Bearer {apiKey}");

        var requestBody = new
        {
            model = "gpt-4o-mini",
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            temperature = 0.7,
            max_tokens = 1000
        };

        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.SendAsync(request);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("OpenAI API error: {StatusCode} - {Content}", response.StatusCode, errorContent);
            throw new HttpRequestException($"OpenAI API error: {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var jsonDocument = JsonDocument.Parse(responseContent);
        
        var message = jsonDocument.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return message ?? string.Empty;
    }

    private string BuildContext(List<ArticleListDto> articles)
    {
        var sb = new StringBuilder();
        
        foreach (var article in articles.Take(5)) // Limit to top 5 articles for context
        {
            sb.AppendLine($"Title: {article.Title}");
            if (!string.IsNullOrEmpty(article.Summary))
            {
                sb.AppendLine($"Summary: {article.Summary}");
            }
            sb.AppendLine($"ID: {article.ArticleId}");
            sb.AppendLine("---");
        }

        return sb.ToString();
    }
}
