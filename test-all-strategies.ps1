# PowerShell script to test all response strategies
# This script tests pre-computed responses, vector search, and mock responses

# Configuration
$apiBaseUrl = "http://localhost:3009"
$systemPrompt = "You are an immigration assistant for the Visafy platform."

# Function to test a specific query with given options
function Test-Query {
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
        Write-Host "Response Time: $($response.responseTime) seconds" -ForegroundColor Green
        
        if ($response.source) {
            Write-Host "Source: $($response.source)" -ForegroundColor Green
        }
        
        Write-Host "`nResponse Preview (first 200 chars):" -ForegroundColor Magenta
        $previewText = $response.response
        if ($previewText.Length -gt 200) {
            $previewText = $previewText.Substring(0, 200) + "..."
        }
        Write-Host $previewText -ForegroundColor White
        
        return $true
    }
    catch {
        Write-Host "Error testing query: $_" -ForegroundColor Red
        return $false
    }
}

# Test 1: Pre-computed Response (Medical Examination)
Test-Query -name "Pre-computed Response (Medical)" -query "What is involved in an immigration medical examination?" -usePreComputed $true -useVectorSearch $true -useFastModel $false -useMockInProduction $true

# Test 2: Pre-computed Response (Language Testing)
Test-Query -name "Pre-computed Response (Language)" -query "Tell me about language tests for immigration" -usePreComputed $true -useVectorSearch $true -useFastModel $false -useMockInProduction $true

# Test 3: Vector Search with Mock Response (Documents)
Test-Query -name "Vector Search (Documents)" -query "What documents do I need for immigration?" -usePreComputed $false -useVectorSearch $true -useFastModel $false -useMockInProduction $true

# Test 4: Vector Search with Mock Response (Points System)
Test-Query -name "Vector Search (Points System)" -query "How does the points-based immigration system work?" -usePreComputed $false -useVectorSearch $true -useFastModel $false -useMockInProduction $true

# Test 5: Fast Model Response (if Ollama is available)
Test-Query -name "Fast Model Response" -query "What is Express Entry?" -usePreComputed $false -useVectorSearch $true -useFastModel $true -useMockInProduction $false

# Test 6: Fallback to Mock Response
Test-Query -name "Fallback to Mock" -query "Tell me about immigration interviews" -usePreComputed $false -useVectorSearch $false -useFastModel $false -useMockInProduction $true
