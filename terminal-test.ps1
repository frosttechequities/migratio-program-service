# Simple terminal-friendly test script for Ollama integration

# Test the health endpoint
Write-Host "Testing health endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3009/health" -Method Get
    Write-Host "Health Status: $($healthResponse.status)" -ForegroundColor Green
    Write-Host "Message: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "Health endpoint error: $_" -ForegroundColor Red
}

# Test pre-computed response
Write-Host "`nTesting pre-computed response..." -ForegroundColor Cyan
$preComputedBody = @{
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

try {
    $preComputedResponse = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $preComputedBody -ContentType "application/json"
    Write-Host "Pre-computed response received" -ForegroundColor Green
    Write-Host "Is Pre-computed: $($preComputedResponse.isPreComputed)" -ForegroundColor Green
    Write-Host "Response Time: $($preComputedResponse.responseTime) seconds" -ForegroundColor Green
    if ($preComputedResponse.source) {
        Write-Host "Source: $($preComputedResponse.source)" -ForegroundColor Green
    }
    Write-Host "Response Preview: $($preComputedResponse.response.Substring(0, [Math]::Min(100, $preComputedResponse.response.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "Pre-computed response error: $_" -ForegroundColor Red
}

# Test vector search with mock response
Write-Host "`nTesting vector search with mock response..." -ForegroundColor Cyan
$vectorSearchBody = @{
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

try {
    $vectorSearchResponse = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $vectorSearchBody -ContentType "application/json"
    Write-Host "Vector search response received" -ForegroundColor Green
    Write-Host "Model: $($vectorSearchResponse.model)" -ForegroundColor Green
    Write-Host "Method: $($vectorSearchResponse.method)" -ForegroundColor Green
    Write-Host "Has Context: $($vectorSearchResponse.hasContext)" -ForegroundColor Green
    Write-Host "Has Relevant Context: $($vectorSearchResponse.hasRelevantContext)" -ForegroundColor Green
    Write-Host "Response Time: $($vectorSearchResponse.responseTime) seconds" -ForegroundColor Green
    Write-Host "Response Preview: $($vectorSearchResponse.response.Substring(0, [Math]::Min(100, $vectorSearchResponse.response.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "Vector search response error: $_" -ForegroundColor Red
}

# Test fallback to mock response
Write-Host "`nTesting fallback to mock response..." -ForegroundColor Cyan
$mockResponseBody = @{
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

try {
    $mockResponse = Invoke-RestMethod -Uri "http://localhost:3009/chat" -Method Post -Body $mockResponseBody -ContentType "application/json"
    Write-Host "Mock response received" -ForegroundColor Green
    Write-Host "Model: $($mockResponse.model)" -ForegroundColor Green
    Write-Host "Method: $($mockResponse.method)" -ForegroundColor Green
    Write-Host "Response Time: $($mockResponse.responseTime) seconds" -ForegroundColor Green
    Write-Host "Response Preview: $($mockResponse.response.Substring(0, [Math]::Min(100, $mockResponse.response.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "Mock response error: $_" -ForegroundColor Red
}

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
