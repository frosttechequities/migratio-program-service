# First check the health endpoint to see if Hugging Face is available
Write-Host "Checking health endpoint..."
$health = Invoke-RestMethod -Uri "http://localhost:3006/health" -Method Get
Write-Host "Health Status: $($health.status)"
Write-Host "Hugging Face Available: $($health.huggingFaceAvailable)"
Write-Host "Ollama Available: $($health.ollamaAvailable)"
Write-Host "Timestamp: $($health.timestamp)"
Write-Host ""

# Test chat endpoint with Hugging Face integration - No Mock Data
$body = @{
    messages = @(
        @{
            role = "user"
            content = "How does the points-based immigration system work?"
        }
    )
    systemPrompt = "You are an immigration assistant"
    usePreComputed = $false           # Don't use pre-computed responses
    useVectorSearch = $true           # Use vector search
    useFastModel = $false             # Don't use fast model
    useMockInProduction = $false      # Don't use mock data in production
    forceHuggingFace = $true          # Force using Hugging Face
    disableMockFallback = $true       # Disable mock fallback completely
} | ConvertTo-Json

Write-Host "Sending request to test chat endpoint..."
$response = Invoke-RestMethod -Uri "http://localhost:3006/chat" -Method Post -Body $body -ContentType "application/json"

Write-Host "Response received!"
Write-Host "Model: $($response.model)"
Write-Host "Method: $($response.method)"
Write-Host "Has Context: $($response.hasContext)"
Write-Host "Response Time: $($response.responseTime) seconds"

if ($response.source) {
    Write-Host "Source: $($response.source)"
}

Write-Host "`nResponse Preview (first 200 chars):"
$previewText = $response.response
if ($previewText.Length -gt 200) {
    $previewText = $previewText.Substring(0, 200) + "..."
}
Write-Host $previewText

# Save the full response to a file for inspection
$response.response | Out-File -FilePath "chat-response.txt"
Write-Host "`nFull response saved to: chat-response.txt"
