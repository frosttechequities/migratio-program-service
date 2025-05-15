# Test fallback to mock response
$body = @{
    messages = @(
        @{
            role = "user"
            content = "Tell me about immigration interviews"
        }
    )
    systemPrompt = "You are an immigration assistant"
    usePreComputed = $false
    useVectorSearch = $false
    useFastModel = $false
    useMockInProduction = $true
} | ConvertTo-Json

Write-Host "Sending request to test mock response..."
$response = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $body -ContentType "application/json"

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
$response.response | Out-File -FilePath "mock-response.txt"
Write-Host "`nFull response saved to: mock-response.txt"
