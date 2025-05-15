# Test Ollama integration
$body = @{
    messages = @(
        @{
            role = "user"
            content = "How do I prepare for an immigration interview?"
        }
    )
    systemPrompt = "You are an immigration assistant"
    usePreComputed = $false
    useVectorSearch = $true
    useFastModel = $true
    useMockInProduction = $false
} | ConvertTo-Json

$startTime = Get-Date

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $body -ContentType "application/json"
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "Model: $($response.model)"
    Write-Host "Method: $($response.method)"
    Write-Host "Has Context: $($response.hasContext)"
    Write-Host "Has Relevant Context: $($response.hasRelevantContext)"
    Write-Host "Response Time: $($response.responseTime) seconds"
    Write-Host "Total Time: $($duration.ToString("0.00")) seconds"
    
    if ($response.source) {
        Write-Host "Source: $($response.source)"
    }
    
    Write-Host "`nResponse Preview (first 200 chars):"
    $previewText = $response.response
    if ($previewText.Length -gt 200) {
        $previewText = $previewText.Substring(0, 200) + "..."
    }
    Write-Host $previewText
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
