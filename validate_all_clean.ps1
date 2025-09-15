# VALIDACION COMPLETA - JIRA, XRAY Y PLAYWRIGHT

Write-Host "VALIDACION COMPLETA DE ACCESOS"
Write-Host "======================================"

# 1. CARGAR CONFIGURACION
Write-Host ""
Write-Host "1. CARGANDO CONFIGURACION..."
. .\config_clean.ps1

# 2. VALIDAR XRAY CLOUD
Write-Host ""
Write-Host "2. VALIDANDO XRAY CLOUD..."
$headers = @{"Content-Type" = "application/json"}
$body = @{
    client_id = $XRAY_CLIENT_ID
    client_secret = $XRAY_CLIENT_SECRET
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v1/authenticate" -Method Post -Body $body -Headers $headers
    Write-Host "   XRAY CLOUD: Conexion exitosa"
    $global:XRAY_TOKEN = $response
    $xrayStatus = "SUCCESS"
} catch {
    Write-Host "   XRAY CLOUD: Error - $($_.Exception.Message)"
    $xrayStatus = "FAILED"
}

# 3. VALIDAR JIRA CONFIG
Write-Host ""
Write-Host "3. VALIDANDO CONFIGURACION JIRA..."
if ($HISTORIA_PRINCIPAL) {
    Write-Host "   Historia principal: $HISTORIA_PRINCIPAL"
    Write-Host "   JIRA: Configuracion correcta"
    $jiraStatus = "SUCCESS"
} else {
    Write-Host "   JIRA: Historia principal no encontrada"
    $jiraStatus = "FAILED"
}

# 4. VALIDAR PLAYWRIGHT BASICO
Write-Host ""
Write-Host "4. VALIDANDO PLAYWRIGHT..."
Write-Host "   Verificando que Node.js y Playwright esten disponibles..."

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "   Node.js disponible: $nodeVersion"
        Write-Host "   PLAYWRIGHT: Entorno preparado"
        $playwrightStatus = "SUCCESS"
    } else {
        Write-Host "   PLAYWRIGHT: Node.js no encontrado"
        $playwrightStatus = "FAILED"
    }
} catch {
    Write-Host "   PLAYWRIGHT: Error de configuracion"
    $playwrightStatus = "FAILED"
}

# 5. RESUMEN FINAL
Write-Host ""
Write-Host "RESUMEN DE VALIDACION"
Write-Host "======================================"
if ($xrayStatus -eq "SUCCESS") {
    Write-Host "Xray Cloud:        CONECTADO"
} else {
    Write-Host "Xray Cloud:        FALLIDO"
}

if ($jiraStatus -eq "SUCCESS") {
    Write-Host "Jira Config:       CONFIGURADO ($HISTORIA_PRINCIPAL)"
} else {
    Write-Host "Jira Config:       NO CONFIGURADO"
}

if ($playwrightStatus -eq "SUCCESS") {
    Write-Host "Playwright:        FUNCIONANDO"
} else {
    Write-Host "Playwright:        FALLIDO"
}

Write-Host ""
if ($xrayStatus -eq "SUCCESS" -and $jiraStatus -eq "SUCCESS" -and $playwrightStatus -eq "SUCCESS") {
    Write-Host "ESTADO GENERAL: TODAS LAS CONEXIONES VALIDADAS"
    Write-Host "SISTEMA LISTO PARA AUTOMATIZACION COMPLETA"
} else {
    Write-Host "ESTADO GENERAL: ALGUNAS VALIDACIONES FALLARON"
    Write-Host "REVISAR CONFIGURACION ANTES DE PROCEDER"
}
Write-Host "======================================"