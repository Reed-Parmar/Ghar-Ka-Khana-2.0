# Test API endpoints
Write-Host "Testing API endpoints..."

# Test registration
Write-Host "`n1. Testing User Registration..."
try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/users/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"Debug User","email":"debug@example.com","password":"password123"}'
    Write-Host "Registration Status: $($registerResponse.StatusCode)"
    Write-Host "Registration Response: $($registerResponse.Content)"
} catch {
    Write-Host "Registration Error: $($_.Exception.Message)"
}

# Test login
Write-Host "`n2. Testing User Login..."
try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/users/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"debug@example.com","password":"password123"}'
    Write-Host "Login Status: $($loginResponse.StatusCode)"
    Write-Host "Login Response: $($loginResponse.Content)"
} catch {
    Write-Host "Login Error: $($_.Exception.Message)"
    Write-Host "Error Details: $($_.Exception.Response)"
}

# Test meals endpoint
Write-Host "`n3. Testing Meals Endpoint..."
try {
    $mealsResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/meals/all" -Method GET
    Write-Host "Meals Status: $($mealsResponse.StatusCode)"
    Write-Host "Meals Response: $($mealsResponse.Content)"
} catch {
    Write-Host "Meals Error: $($_.Exception.Message)"
}
