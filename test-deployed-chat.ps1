# Test the chat endpoint of the deployed service with Hugging Face integration
$serviceUrl = "https://visafy-vector-search-service.onrender.com"

# First check the health endpoint
Write-Host "Checking health endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$serviceUrl/health" -Method Get
    Write-Host "Health Status: $($health.status)" -ForegroundColor Green
    Write-Host "Hugging Face Available: $($health.huggingFaceAvailable)" -ForegroundColor Green
    Write-Host "Timestamp: $($health.timestamp)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "Error checking health endpoint: $_" -ForegroundColor Red
    Write-Host "Continuing with chat test anyway..." -ForegroundColor Yellow
    Write-Host ""
}

# Test chat endpoint with Hugging Face integration
$body = @{
    messages = @(
        @{
            role = "user"
            content = "What documents do I need for immigration?"
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

Write-Host "Sending request to test chat endpoint with Hugging Face integration..." -ForegroundColor Cyan
$startTime = Get-Date

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/chat" -Method Post -Body $body -ContentType "application/json"
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    Write-Host "Response received in $($duration.ToString("0.00")) seconds!" -ForegroundColor Green
    Write-Host "Model: $($response.model)" -ForegroundColor Green
    Write-Host "Method: $($response.method)" -ForegroundColor Green
    Write-Host "Has Context: $($response.hasContext)" -ForegroundColor Green
    
    if ($response.responseTime) {
        Write-Host "Response Time: $($response.responseTime) seconds" -ForegroundColor Green
    }
    
    if ($response.source) {
        Write-Host "Source: $($response.source)" -ForegroundColor Green
    }
    
    Write-Host "`nResponse Preview (first 200 chars):" -ForegroundColor Magenta
    $previewText = $response.response
    if ($previewText.Length -gt 200) {
        $previewText = $previewText.Substring(0, 200) + "..."
    }
    Write-Host $previewText -ForegroundColor White
    
    # Save the full response to a file for inspection
    $response.response | Out-File -FilePath "deployed-chat-response.txt"
    Write-Host "`nFull response saved to: deployed-chat-response.txt" -ForegroundColor Green
    
    # Verify if Hugging Face was used
    if ($response.method -eq "huggingface") {
        Write-Host "`nSuccess! The response was generated using Hugging Face." -ForegroundColor Green
    } else {
        Write-Host "`nWarning: The response was not generated using Hugging Face. Method used: $($response.method)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error testing chat endpoint: $_" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        try {
            $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "Error Message: $($errorContent.error)" -ForegroundColor Red
        } catch {
            Write-Host "Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nTroubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check if the HUGGINGFACE_API_TOKEN is set correctly in the Render dashboard" -ForegroundColor Yellow
    Write-Host "2. Verify that the service is fully deployed and running" -ForegroundColor Yellow
    Write-Host "3. Check the Render logs for any errors" -ForegroundColor Yellow
}
