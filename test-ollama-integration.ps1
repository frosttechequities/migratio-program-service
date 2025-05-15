# PowerShell script to test the enhanced Ollama integration
# This script tests all the different response strategies

# Configuration
$apiBaseUrl = "http://localhost:3009"
$testQueries = @(
    # Pre-computed response tests
    @{
        name = "Medical Examination Query"
        query = "What is involved in an immigration medical examination?"
        usePreComputed = $true
        useVectorSearch = $true
        useFastModel = $false
        useMockInProduction = $true
    },
    @{
        name = "Language Test Query"
        query = "Tell me about language tests for immigration"
        usePreComputed = $true
        useVectorSearch = $true
        useFastModel = $false
        useMockInProduction = $true
    },
    # Vector search tests
    @{
        name = "Vector Search Query"
        query = "What documents do I need for immigration?"
        usePreComputed = $false
        useVectorSearch = $true
        useFastModel = $false
        useMockInProduction = $true
    },
    # Fast model tests
    @{
        name = "Fast Model Query"
        query = "How do I prepare for an immigration interview?"
        usePreComputed = $false
        useVectorSearch = $true
        useFastModel = $true
        useMockInProduction = $false
    },
    # Mock response tests
    @{
        name = "Mock Response Query"
        query = "What is the points system for immigration?"
        usePreComputed = $false
        useVectorSearch = $false
        useFastModel = $false
        useMockInProduction = $true
    }
)

# System prompt for all tests
$systemPrompt = @"
You are an immigration assistant for the Visafy platform. Your role is to provide accurate, factual information about immigration processes, requirements, and documentation.

IMPORTANT GUIDELINES:
1. Only provide factual information about real immigration processes and documents.
2. If you're unsure about specific details, acknowledge the limitations of your knowledge.
3. Structure your responses clearly with headings, bullet points, and numbered lists when appropriate.
4. Focus on being helpful, concise, and accurate rather than comprehensive.
5. Do not make up names of forms or documents that you're not certain exist.
6. When possible, mention official sources where users can find more information.
"@

# Function to test the health endpoint
function Test-HealthEndpoint {
    Write-Host "`n===== Testing Health Endpoint =====" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBaseUrl/health" -Method Get
        
        Write-Host "Status: $($response.status)" -ForegroundColor Green
        Write-Host "Message: $($response.message)" -ForegroundColor Green
        Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "Error testing health endpoint: $_" -ForegroundColor Red
        return $false
    }
}

# Function to test a chat query
function Test-ChatQuery {
    param (
        [Parameter(Mandatory=$true)]
        [string]$name,
        
        [Parameter(Mandatory=$true)]
        [string]$query,
        
        [Parameter(Mandatory=$false)]
        [bool]$usePreComputed = $true,
        
        [Parameter(Mandatory=$false)]
        [bool]$useVectorSearch = $true,
        
        [Parameter(Mandatory=$false)]
        [bool]$useFastModel = $false,
        
        [Parameter(Mandatory=$false)]
        [bool]$useMockInProduction = $true
    )
    
    Write-Host "`n===== Testing: $name =====" -ForegroundColor Cyan
    Write-Host "Query: $query" -ForegroundColor Yellow
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  - Use Pre-computed: $usePreComputed" -ForegroundColor Yellow
    Write-Host "  - Use Vector Search: $useVectorSearch" -ForegroundColor Yellow
    Write-Host "  - Use Fast Model: $useFastModel" -ForegroundColor Yellow
    Write-Host "  - Use Mock in Production: $useMockInProduction" -ForegroundColor Yellow
    
    $body = @{
        messages = @(
            @{
                role = "user"
                content = $query
            }
        )
        systemPrompt = $systemPrompt
        timeout = 180000
        usePreComputed = $usePreComputed
        useVectorSearch = $useVectorSearch
        useFastModel = $useFastModel
        useMockInProduction = $useMockInProduction
    } | ConvertTo-Json
    
    $startTime = Get-Date
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBaseUrl/chat" -Method Post -Body $body -ContentType "application/json"
        
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        Write-Host "`nResponse received in $($duration.ToString("0.00")) seconds" -ForegroundColor Green
        Write-Host "Model: $($response.model)" -ForegroundColor Green
        Write-Host "Method: $($response.method)" -ForegroundColor Green
        Write-Host "Has Context: $($response.hasContext)" -ForegroundColor Green
        Write-Host "Has Relevant Context: $($response.hasRelevantContext)" -ForegroundColor Green
        Write-Host "Is Pre-computed: $($response.isPreComputed)" -ForegroundColor Green
        
        if ($response.source) {
            Write-Host "Source: $($response.source)" -ForegroundColor Green
        }
        
        Write-Host "`nResponse Preview (first 200 chars):" -ForegroundColor Magenta
        $previewText = $response.response
        if ($previewText.Length -gt 200) {
            $previewText = $previewText.Substring(0, 200) + "..."
        }
        Write-Host $previewText -ForegroundColor White
        
        # Save the full response to a file
        $fileName = "$name-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
        $response.response | Out-File -FilePath $fileName
        Write-Host "`nFull response saved to: $fileName" -ForegroundColor Green
        
        return $true
    }
    catch {
        Write-Host "Error testing chat query: $_" -ForegroundColor Red
        return $false
    }
}

# Main test execution
Write-Host "Starting Ollama Integration Tests" -ForegroundColor Cyan
Write-Host "API Base URL: $apiBaseUrl" -ForegroundColor Cyan
Write-Host "Test Time: $(Get-Date)" -ForegroundColor Cyan

# Test health endpoint
$healthOk = Test-HealthEndpoint

if (-not $healthOk) {
    Write-Host "`nHealth check failed. Make sure the server is running." -ForegroundColor Red
    exit 1
}

# Test each query
$successCount = 0
$totalTests = $testQueries.Count

foreach ($test in $testQueries) {
    $result = Test-ChatQuery -name $test.name -query $test.query -usePreComputed $test.usePreComputed -useVectorSearch $test.useVectorSearch -useFastModel $test.useFastModel -useMockInProduction $test.useMockInProduction
    
    if ($result) {
        $successCount++
    }
    
    # Add a small delay between tests
    Start-Sleep -Seconds 2
}

# Print summary
Write-Host "`n===== Test Summary =====" -ForegroundColor Cyan
Write-Host "Tests Passed: $successCount / $totalTests" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host "Success Rate: $(($successCount / $totalTests * 100).ToString("0.00"))%" -ForegroundColor $(if ($successCount -eq $totalTests) { "Green" } else { "Yellow" })

if ($successCount -eq $totalTests) {
    Write-Host "`nAll tests passed successfully!" -ForegroundColor Green
}
else {
    Write-Host "`nSome tests failed. Check the output for details." -ForegroundColor Yellow
}
