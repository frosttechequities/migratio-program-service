# Test vector search with mock responses
$body = @{
    messages = @(
        @{
            role = "user"
            content = "What documents do I need for immigration?"
        }
    )
    systemPrompt = "You are an immigration assistant"
    usePreComputed = $false
    useVectorSearch = $true
    useFastModel = $false
    useMockInProduction = $true
} | ConvertTo-Json

Write-Host "Sending request to test vector search..."
$response = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $body -ContentType "application/json"

Write-Host "Response received!"
Write-Host "Model: $($response.model)"
Write-Host "Method: $($response.method)"
Write-Host "Has Context: $($response.hasContext)"
Write-Host "Has Relevant Context: $($response.hasRelevantContext)"
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
$response.response | Out-File -FilePath "vector-search-response.txt"
Write-Host "`nFull response saved to: vector-search-response.txt"
