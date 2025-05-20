# Test the health endpoint of the deployed service
$serviceUrl = "https://visafy-vector-search-service.onrender.com"

Write-Host "Testing health endpoint at $serviceUrl/health..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/health" -Method Get
    
    Write-Host "Health Status: $($response.status)" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    Write-Host "Hugging Face Available: $($response.huggingFaceAvailable)" -ForegroundColor Green
    Write-Host "Ollama Available: $($response.ollamaAvailable)" -ForegroundColor Green
    Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Green
    
    if ($response.status -eq "ok") {
        Write-Host "`nService is running correctly!" -ForegroundColor Green
    } else {
        Write-Host "`nService is reporting issues!" -ForegroundColor Yellow
    }
    
    if ($response.huggingFaceAvailable) {
        Write-Host "Hugging Face API is available." -ForegroundColor Green
    } else {
        Write-Host "Hugging Face API is not available. Check the API token in the Render dashboard." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error testing health endpoint: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "The service might not be deployed yet or the URL is incorrect." -ForegroundColor Red
    } elseif ($_.Exception.Response.StatusCode.value__ -eq 503) {
        Write-Host "The service might be in the process of starting up. Try again in a few minutes." -ForegroundColor Yellow
    }
}
