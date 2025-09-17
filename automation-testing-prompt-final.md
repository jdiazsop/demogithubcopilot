# 🤖 AUTOMATIZACIÓN COMPLETA DE TESTING CON GITHUB COPILOT

## 📋 CONFIGURACIÓN DEL PROYECTO

**HISTORIA PRINCIPAL**: `DEM-1`  
*← Solo editar esta línea con el ID real de la historia (ej: DEM-1, STORY-123, etc.)*

---

## 🔄 PROCESO COMPLETAMENTE AUTOMÁTICO Y DINÁMICO

- Primero valida accesos con config_clean.ps1 y validate_all_clean.ps1
- Tiene que haber acceso a todo, en caso se pierda acceso a 1 integración no continua el proceso automatizado.
 
### 1. ANÁLISIS AUTOMÁTICO DESDE LA HISTORIA

**PASO 1**: Buscar la historia principal configurada arriba (ej: DEM-1)  
**PASO 2**: Desde esa historia, identificar automáticamente:

- 📋 **Test Plan** asociado a la historia (AUTO-DESCUBIERTO)
- 🧪 **Test Execution** dentro del test plan (AUTO-DESCUBIERTO)
- ✅ **TODOS los Test Cases** asociados (dinámico: puede ser 1, 2, 5, 10, 20...)
- 📝 **Descripción paso a paso** de cada caso de prueba encontrado

**PASO 3**: Extraer automáticamente TODOS los IDs para uso en scripts

⚠️ **IMPORTANTE**: El sistema debe ser completamente dinámico y escalable:
- Si la historia tiene 2 test cases → ejecutar 2
- Si la historia tiene 10 test cases → ejecutar 10  
- Si agregan más casos después → debe detectarlos automáticamente

### 2. EJECUCIÓN DE TESTING

- Ejecuta el script de automatización basado en descripciones de test cases en Jira
- **⚠️ CRÍTICO - ADHERENCIA ESTRICTA**: Al momento de ejecutar cada caso de prueba, **CEÑIRSE EXACTAMENTE al paso a paso redactado en el caso de prueba de Jira**. NO agregar pasos adicionales, validaciones extra o funcionalidades que no estén específicamente descritas en el test case original.
- Realiza testing end-to-end con Playwright:
  - Navegador: Chrome con configuración regional específica
  - **Browser Closure**: Los navegadores se cierran correctamente al final de cada test
  - Validaciones: Navegación, interacciones UI, comportamiento de modales
  - Captura de evidencias y validación de resultados

### 3. TRANSICIONES AUTOMÁTICAS EN JIRA

- **HISTORIA PRINCIPAL**: Transicionar DEM-1 a estado apropiado
- **TEST EXECUTION**: El execution AUTO-DESCUBIERTO debe transicionarse a "Finalizada" 
- **⚠️ CRÍTICO**: Actualizar la TABLA INTERNA de test cases dentro del execution AUTO-DESCUBIERTO:
  - TODOS los test cases encontrados: TO DO → PASSED ✅
  - (Dinámico: pueden ser 2, 5, 10+ test cases)
- **Test Cases Individuales**: NO cambiar estado (mantener como están)
- Agregar comentarios con evidencia de ejecución a cada issue

**IMPORTANTE**: La actualización debe ser visible en la tabla de "Tests" dentro del execution AUTO-DESCUBIERTO

### 4. INTEGRACIÓN JIRA/XRAY AUTOMÁTICA

**⚠️ CRÍTICO**: **NUNCA CREAR NUEVO TEST EXECUTION** - usar el existente asociado a la historia

**PASO OBLIGATORIO**: Descubrir y actualizar automáticamente TODOS los test cases asociados:

```powershell
# Archivo: xray_update_dynamic.ps1
# DESCUBRE AUTOMÁTICAMENTE TODOS LOS TEST CASES Y ACTUALIZA EL EXECUTION EXISTENTE

# 1. CARGAR CONFIGURACIÓN CENTRALIZADA
. .\config_clean.ps1

# 2. AUTENTICACIÓN XRAY (USANDO CREDENCIALES CENTRALIZADAS)
$authBody = @{
    client_id = $XRAY_CLIENT_ID
    client_secret = $XRAY_CLIENT_SECRET
} | ConvertTo-Json

$xrayToken = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v1/authenticate" -Method Post -Body $authBody -ContentType "application/json"

# 2. DESCUBRIMIENTO AUTOMÁTICO DESDE LA HISTORIA
# ⚠️ ESTOS VALORES SE LLENAN AUTOMÁTICAMENTE DESDE EL ANÁLISIS DE JIRA
$HISTORIA_ID = "DEM-1"                                    # Historia principal configurada
$TEST_EXECUTION_ID = "AUTO_DISCOVERED_FROM_HISTORIA"     # Se encuentra automáticamente
$ALL_TEST_CASES = @()                                    # Se llena automáticamente con TODOS los casos

# 3. LÓGICA DE DESCUBRIMIENTO (EJECUTADA POR GITHUB COPILOT)
# Este bloque se reemplaza automáticamente con los IDs reales encontrados:
#
# Ejemplo de lo que se genera automáticamente:
# $TEST_EXECUTION_ID = "AUTO-DISCOVERED-EXECUTION-ID"
# $ALL_TEST_CASES = @("TEST-1", "TEST-2", "TEST-3", "TEST-N")  # Todos los encontrados
#
# $resultados = @()
# foreach ($testCase in $ALL_TEST_CASES) {
#     $resultados += @{ 
#         id = $testCase
#         status = "PASS"  # o "FAIL" según resultado de Playwright
#         comment = "Automated test execution completed successfully ✅"
#     }
# }

# 4. ACTUALIZACIÓN DINÁMICA DEL EXECUTION EXISTENTE
$testsArray = $resultados | ForEach-Object { 
    @{
        testKey = $_.id
        status = $_.status
        comment = $_.comment
    }
}

$executionData = @{
    testExecutionKey = $TEST_EXECUTION_ID    # ← DESCUBIERTO AUTOMÁTICAMENTE
    tests = $testsArray                      # ← TODOS LOS CASOS ENCONTRADOS
} | ConvertTo-Json -Depth 3

$headers = @{"Authorization" = "Bearer $xrayToken"; "Content-Type" = "application/json"}

$result = Invoke-RestMethod -Uri "https://xray.cloud.getxray.app/api/v1/import/execution" -Method Post -Headers $headers -Body $executionData

Write-Host "✅ TEST EXECUTION actualizado con $($ALL_TEST_CASES.Count) test cases: $($result | ConvertTo-Json)" -ForegroundColor Green
```

### 🔧 SCRIPT DE ACTUALIZACIÓN DE ESTADOS XRAY

**Para actualizar los test cases dentro del test execution**, usar el script específico:

```powershell
# Ejecutar script específico para actualizar estados en tabla Xray
.\update_test_results.ps1
```

**Características del script `update_test_results.ps1`**:
- ✅ **Configuración centralizada**: Usa credenciales de `config_clean.ps1` automáticamente
- ✅ **Historia dinámica**: Extrae automáticamente la historia principal del prompt
- ✅ **Autenticación Xray**: Obtiene token usando credenciales verificadas
- ✅ **Actualización directa**: Modifica estados de test cases en la tabla Tests
- ✅ **Validación**: Cambia específicamente DEM-3 y DEM-4 de "TO DO" a "PASSED"
- ✅ **Feedback**: Muestra confirmación de que los estados fueron actualizados

**⚠️ REGLAS CRÍTICAS**:
- **JAMÁS usar** `/import/execution` para crear un nuevo execution
- **SIEMPRE actualizar** el test execution que ya está asociado a la historia
- **EJECUTAR `update_test_results.ps1`** después de la automatización Playwright
- **Verificar** que TODOS los test cases encontrados cambien de "TO DO" a estado final en la tabla

---

## 🎯 INSTRUCCIONES PARA GITHUB COPILOT

Eres un **Automation Test Engineer** especializado en testing end-to-end con Playwright y gestión de test cases en Jira/Xray. Tu objetivo es automatizar completamente el ciclo de testing: desde la identificación de casos de prueba hasta la actualización de resultados.

### PROCESO PASO A PASO:

1. **Análisis Automático Dinámico**:
   - Conectar a Jira usando las credenciales de Atlassian MCP
   - Buscar la historia principal especificada arriba (DEM-1)
   - Descubrir automáticamente TODOS los test cases asociados (sin límite)
   - Identificar el test execution correspondiente existente

2. **Ejecución Testing Escalable**:
   - Crear scripts Playwright dinámicos basados en descripciones de Jira
   - **⚠️ MANDATORIO**: Seguir ÚNICAMENTE los pasos exactos descritos en cada test case de Jira, sin agregar validaciones o interacciones adicionales
   - Ejecutar automáticamente TODOS los test cases encontrados (1, 5, 10, 50...)
   - **IMPORTANTE**: Cerrar navegadores al final de cada test
   - Capturar evidencias y resultados para todos los casos

3. **Actualización Resultados Completa**:
   - **SOLO actualizar tabla de Xray** (no estados individuales de test cases)
   - Usar EXACTAMENTE las credenciales verificadas: `28C3EF2BB6434C249B23CB55475F9A6B`
   - **EJECUTAR `.\update_test_results.ps1`** para actualizar estados en tabla Xray
   - Actualizar TODOS los test cases encontrados en el execution existente

4. **Comentario y Finalización del Test Execution** ⭐:
   - **Agregar comentario**: Usar MCP Atlassian `addCommentToJiraIssue` en el test execution
   - **Contenido del comentario**: Resumen de ejecución, casos probados, evidencias, estado final
   - **Transición de estado**: Usar MCP Atlassian `transitionJiraIssue` para cambiar test execution a "DONE"
   - **Verificación**: Confirmar que el test execution muestre estado final correcto
   - Transicionar historia principal apropiadamente
   - Documentar completamente el proceso

### CONFIGURACIÓN ESPECÍFICA:

```powershell
# Variables que se llenan automáticamente desde el análisis de la historia
$HISTORIA_PRINCIPAL = "DEM-1"                              # Historia base (editable arriba)
$PROJECT_TESTPLAN = "AUTO_DISCOVERED_FROM_HISTORIA"        # Test Plan encontrado automáticamente
$PROJECT_EXECUTION = "AUTO_DISCOVERED_FROM_HISTORIA"       # Test Execution encontrado automáticamente  
$ALL_TEST_CASES = @()                                      # Array dinámico con TODOS los test cases

# 🤖 PROCESO AUTOMÁTICO DE DESCUBRIMIENTO:
# 1. Analizar DEM-1 y encontrar test plan asociado
# 2. Dentro del test plan, encontrar test execution(s) 
# 3. Extraer TODOS los test cases del execution (pueden ser 1, 5, 10, 20...)
# 4. Ejecutar Playwright para cada test case encontrado
# 5. Actualizar resultados dinámicamente en el execution existente

# Ejemplo de resultado automático:
# $PROJECT_TESTPLAN = "AUTO-DISCOVERED-PLAN-ID"
# $PROJECT_EXECUTION = "AUTO-DISCOVERED-EXECUTION-ID" 
# $ALL_TEST_CASES = @("TEST-A", "TEST-B", "TEST-C", "TEST-D", "TEST-E")
```

### ⚠️ VALIDACIONES CRÍTICAS:

- ✅ **Descubrimiento dinámico** - NO hardcodear IDs específicos
- ✅ **USAR test execution existente** - NO crear uno nuevo
- ✅ **Escalar automáticamente** - soportar 1, 5, 10 o más test cases
- ✅ **ADHERENCIA ESTRICTA AL TEST CASE** - Ejecutar SOLAMENTE los pasos exactos descritos en Jira, sin agregar funcionalidades extra
- ✅ **Actualizar tabla completa** - TODOS los casos deben cambiar estado
- ✅ **Playwright dinámico** - generar scripts basados en descripciones de Jira
- ✅ Browser closure después de cada test case
- ✅ Documentación completa con evidencias
- ✅ **COMENTARIO EN TEST EXECUTION** - Agregar comentario descriptivo del proceso ejecutado
- ✅ **TRANSICIÓN TEST EXECUTION** - Cambiar estado de "TO DO" a "DONE" tras completar todas las pruebas

---

## 🚀 EJECUCIÓN

**Comando**: Simplemente proporciona el ID de la historia principal arriba y ejecuta:

```
"Ejecutar automatización completa para la historia configurada"
```

El sistema automáticamente:
1. 🔍 Analiza la estructura desde la historia
2. 🧪 Ejecuta todos los test cases encontrados  
3. 📊 Actualiza resultados en Xray con credenciales verificadas
4. 📝 Documenta completamente el proceso

**Resultado**: Test execution completamente automatizado con actualización correcta de Xray y documentación completa.

---

## ⚠️ IMPORTANTE - CORRECCIONES APLICADAS

### Diferencias clave con versiones anteriores:

1. **Browser Closure**: Los navegadores se cierran correctamente
2. **Test Execution Existente**: USAR DEM-5 existente - NO crear uno nuevo  
3. **Actualización Tabla**: Los estados en la tabla de DEM-5 DEBEN cambiar visualmente
4. **Historia Principal**: Se mantiene en estado apropiado para múltiples executions
5. **Credenciales Verificadas**: Usa las credenciales que funcionan correctamente

### 🔧 RESOLUCIÓN DE PROBLEMAS ESPECÍFICOS:

**PROBLEMA 1**: "No crear nuevo test execution"
- ✅ **SOLUCIÓN**: Usar `testExecutionKey = "AUTO-DISCOVERED-EXECUTION-ID"` (el existente)
- ✅ **VERIFICACIÓN**: Confirmar que el execution AUTO-DESCUBIERTO ya existe antes de actualizar

**PROBLEMA 2**: "Estados no se actualizan en la tabla"
- ✅ **SOLUCIÓN**: Usar API `/import/execution` con test execution existente AUTO-DESCUBIERTO
- ✅ **VERIFICACIÓN**: Comprobar que TODOS los test cases cambien de "TO DO" a "PASSED"
- ✅ **ENDPOINT CORRECTO**: `https://xray.cloud.getxray.app/api/v1/import/execution`

**PROBLEMA 3**: "Test cases siguen en TO DO"
- ✅ **CAUSA**: API mal configurado o credenciales incorrectas
- ✅ **SOLUCIÓN**: Usar credenciales verificadas `28C3EF2BB6434C249B23CB55475F9A6B`
- ✅ **SCRIPT ESPECÍFICO**: Ejecutar `.\update_test_results.ps1` para actualización directa
- ✅ **VERIFICACIÓN**: Los resultados deben ser visibles inmediatamente en Jira

**PROBLEMA 4**: "Automatización Xray no actualiza tabla Tests"
- ✅ **CAUSA**: Falta ejecutar script específico para actualización de estados
- ✅ **SOLUCIÓN**: Después de Playwright, ejecutar `.\update_test_results.ps1`
- ✅ **VERIFICACIÓN**: Tabla debe mostrar "2 PASSED" en lugar de "2 TO DO"
- ✅ **CONFIGURACIÓN**: Script usa automáticamente `config_clean.ps1`

**PROBLEMA 5**: "Test Execution no tiene comentario final"
- ✅ **CAUSA**: Falta agregar comentario descriptivo al finalizar la ejecución
- ✅ **SOLUCIÓN**: Usar MCP Atlassian `addCommentToJiraIssue` para agregar comentario al test execution
- ✅ **CONTENIDO**: Incluir resumen de pruebas ejecutadas, estado final y evidencias
- ✅ **VERIFICACIÓN**: El comentario debe ser visible en el issue del test execution

**PROBLEMA 6**: "Test Execution permanece en TO DO"
- ✅ **CAUSA**: Falta cambiar la transición del estado tras completar todas las pruebas
- ✅ **SOLUCIÓN**: Usar MCP Atlassian `transitionJiraIssue` para cambiar estado a "DONE"
- ✅ **TRANSICIÓN**: Obtener transiciones disponibles y aplicar la correspondiente a "Done"
- ✅ **VERIFICACIÓN**: El test execution debe mostrar estado "DONE" en Jira

**SCRIPT DE FINALIZACIÓN**: `finalize_test_execution.ps1`
- ✅ **PROPÓSITO**: Preparar comentario y coordinar finalización del test execution
- ✅ **USO**: Ejecutar después de `update_test_results.ps1` para completar el workflow
- ✅ **FUNCIONES**: Prepara comentario detallado e instrucciones para MCP Atlassian
- ✅ **VERIFICACIÓN**: Confirma que test execution tenga comentario y estado final correcto

**Estas correcciones resuelven completamente los problemas de actualización**

---

## 🎯 SECUENCIA COMPLETA DE EJECUCIÓN

### **ORDEN OBLIGATORIO DE SCRIPTS:**

1. **`validate_all_clean.ps1`** - Validación inicial de conexiones
2. **Ejecución Playwright** - Automatización de test cases con MCP
3. **`update_test_results.ps1`** - Actualización de estados en tabla Xray
4. **`finalize_test_execution.ps1`** - Preparación para finalización
5. **MCP Atlassian tools** - Comentario y transición final

### **VALIDACIONES OBLIGATORIAS AL FINAL:**

✅ **Test Cases**: DEM-3 y DEM-4 deben mostrar estado "PASSED" en tabla Tests  
✅ **Comentario**: Test execution debe tener comentario descriptivo con resumen  
✅ **Transición**: Test execution debe estar en estado "DONE" (no "TO DO")  
✅ **Evidencias**: Screenshots guardados en `.playwright-mcp/`  
✅ **Trazabilidad**: Historia principal actualizada apropiadamente

**SIN ESTAS VALIDACIONES, LA AUTOMATIZACIÓN ESTÁ INCOMPLETA**