# SCRIPT PARA ACTUALIZAR ESTADOS DE TEST CASES EN TABLA XRAY
# USA CONFIGURACION CENTRALIZADA DEL config_clean.ps1

# Cargar configuracion centralizada
. .\config_clean.ps1

Write-Host "=== ACTUALIZACION ESTADOS TEST CASES EN XRAY ==="
Write-Host "Cliente ID: $XRAY_CLIENT_ID"
Write-Host "Historia Principal: $HISTORIA_PRINCIPAL"

# Paso 1: Autenticacion con Xray Cloud
Write-Host "`n1. Obteniendo token de autenticacion Xray..."

$authBody = @{
    client_id = $XRAY_CLIENT_ID
    client_secret = $XRAY_CLIENT_SECRET
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v1/authenticate" -Method POST -ContentType "application/json" -Body $authBody
    $token = $authResponse
    Write-Host "Token obtenido exitosamente: $($token.Substring(0,20))..."
} catch {
    Write-Host "ERROR en autenticacion: $($_.Exception.Message)"
    exit 1
}

# Paso 2: Actualizar ambos test cases en una sola llamada
Write-Host "`n2. Actualizando ambos test cases en tabla Xray..."

$updateAllBody = @{
    testExecutionKey = "DEM-5"
    tests = @(
        @{
            testKey = "DEM-3"
            status = "PASSED"
            comment = "CP-01: Peru/Espanol navigation - PASSED via automation"
        },
        @{
            testKey = "DEM-4" 
            status = "PASSED"
            comment = "CP-02: Modal location/language validation - PASSED via automation"
        }
    )
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $updateAllResponse = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v1/import/execution" -Method POST -Headers $headers -Body $updateAllBody
    Write-Host "AMBOS test cases actualizados a PASSED exitosamente"
    Write-Host "Response: $($updateAllResponse | ConvertTo-Json -Compress)"
} catch {
    Write-Host "ERROR actualizando test cases: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody"
    }
}

Write-Host "`n=== RESULTADO FINAL ==="
Write-Host "Script ejecutado completamente"
Write-Host "Verifica en DEM-5 que la tabla Tests muestre:"
Write-Host "   DEM-3: PASSED"
Write-Host "   DEM-4: PASSED"
Write-Host "   Estado General: 2 PASSED"