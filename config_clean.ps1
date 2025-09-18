# CONFIGURACION CENTRALIZADA - NO CAMBIAR ESTAS CREDENCIALES

# ESTAS SON LAS UNICAS CREDENCIALES VALIDAS PARA XRAY
# CUALQUIER SCRIPT DEBE USAR EXACTAMENTE ESTOS VALORES

# XRAY CLOUD CREDENTIALS - VALIDADAS Y FUNCIONALES
$XRAY_CLIENT_ID = "28C3EF2BB6434C249B23CB55475F9A6B"
$XRAY_CLIENT_SECRET = "e11cc25433d1efcc22483b5eca38ce76fd67fd74e6cbc80c1e9c33a97a991cfc"

# ATLASSIAN CLOUD CREDENTIALS
$ATLASSIAN_CLOUD_ID = "b2afef4f-c63a-41bc-90b8-34a6d6a94f82"
$ATLASSIAN_URL = "https://demojirajorgediaz.atlassian.net"

# JIRA API CREDENTIALS - PARA DESCUBRIMIENTO AUTOMATICO  
$ATLASSIAN_USER = "jorgediazsp25@gmail.com"
$ATLASSIAN_TOKEN = "ATATT3xFfGF0GQYk-Sz-MMCMgw120CHeDXOZUvLzv3WRgAyTyx8j-A3sDYXWvmOK1LvbpPSlVNRNrjttDmi1F49rJnhzgtMI1u0R6UKNecyOmZ9dTldRzaTEJ62qGIp1OqUZOzHcObQNUX1O0CEQyzcgtoL7aRGj4MMN0ogMy1bmH-RTe4nXTjQ=37A583DF"

# TESTING CONFIGURATION
# ESTOS VALORES SE EXTRAEN DINAMICAMENTE DEL ARCHIVO PRINCIPAL
# NO HARDCODEAR AQUI - SE DESCUBREN AUTOMATICAMENTE
$HISTORIA_PRINCIPAL = $null  # Se lee del shift-left-testing.md
$TEST_EXECUTION = $null      # Se descubre automáticamente desde la historia

# FUNCION PARA EXTRAER HISTORIA PRINCIPAL DEL ARCHIVO PROMPT
function Get-HistoriaPrincipal {
    try {
        $promptContent = Get-Content "shift-left-testing.md" -Raw
        if ($promptContent -match '\*\*HISTORIA PRINCIPAL\*\*:\s*`([^`]+)`') {
            return $matches[1]
        }
        Write-Host "ERROR: No se encontro HISTORIA PRINCIPAL en el archivo prompt"
        return $null
    } catch {
        Write-Host "ERROR: No se pudo leer el archivo shift-left-testing.md"
        return $null
    }
}

# EXTRAER HISTORIA PRINCIPAL DINAMICAMENTE
$HISTORIA_PRINCIPAL = Get-HistoriaPrincipal

# CONFIGURAR HEADERS DE AUTENTICACION JIRA
$base64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${ATLASSIAN_USER}:${ATLASSIAN_TOKEN}"))
$headers = @{
    "Authorization" = "Basic $base64"
    "Accept" = "application/json"
}

Write-Host "Configuracion centralizada cargada correctamente"
Write-Host "Xray Client ID: $XRAY_CLIENT_ID"
Write-Host "Atlassian Cloud: $ATLASSIAN_URL"
if ($HISTORIA_PRINCIPAL) {
    Write-Host "Historia Principal (extraida dinamicamente): $HISTORIA_PRINCIPAL"
} else {
    Write-Host "ATENCION: Historia Principal no encontrada - verificar archivo prompt"
}