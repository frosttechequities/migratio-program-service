# Test pre-computed response for medical examination
$body = @{
    messages = @(
        @{
            role = "user"
            content = "What is involved in an immigration medical examination?"
        }
    )
    systemPrompt = "You are an immigration assistant"
    usePreComputed = $true
    useVectorSearch = $true
    useFastModel = $false
    useMockInProduction = $true
} | ConvertTo-Json

$startTime = Get-Date

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $body -ContentType "application/json"
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "Response received in $($duration.ToString("0.00")) seconds"
    Write-Host "Model: $($response.model)"
    Write-Host "Method: $($response.method)"
    Write-Host "Is Pre-computed: $($response.isPreComputed)"
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
    
    # Save the full response to a file
    $response.response | Out-File -FilePath "medical-response.txt"
    Write-Host "Full response saved to: medical-response.txt"
}
catch {
    Write-Host "Error: $_"
}
