# 🔒 AUTOMATIZACIÓN COMPLETA DE SECURITY TESTING CON GITHUB COPILOT

## ⚠️ CONFIGURACIÓN INICIAL DEL IDE

**IMPORTANTE - VISTA DEL IDE**: Al iniciar el proceso automatizado, NO mostrar la terminal ni cambiar la vista de la ventana del IDE. Mantener la vista actual del editor y solo mostrar la terminal si es específicamente requerido para una acción o si el usuario solicita cambiar la vista manualmente.

## 🚫 HERRAMIENTAS PROHIBIDAS PARA USO AUTOMÁTICO

**NO USAR AUTOMÁTICAMENTE ESTAS HERRAMIENTAS**:
- `run_in_terminal` - PROHIBIDO uso automático
- `get_terminal_output` - PROHIBIDO uso automático  
- `terminal_last_command` - PROHIBIDO uso automático
- `terminal_selection` - PROHIBIDO uso automático
- `create_and_run_task` - PROHIBIDO uso automático

**HERRAMIENTAS PERMITIDAS PARA AUTOMATIZACIÓN**:
- ✅ `mcp_atlassian_*` - Para gestión de Jira/Confluence
- ✅ `create_file` - Para generar scripts
- ✅ `read_file` - Para leer configuración
- ✅ `replace_string_in_file` - Para modificar archivos
- ✅ `semantic_search` - Para búsquedas en workspace
- ✅ `manage_todo_list` - Para seguimiento de progreso
- ✅ `mcp_playwright_browser_*` - Para análisis web automático

**REGLA CRÍTICA**: El proceso debe ejecutarse de forma SILENCIOSA manteniendo la vista actual del editor. SOLO usar herramientas MCP y de gestión de archivos.

**REGLA CRÍTICA - CIERRE DE NAVEGADOR**: SIEMPRE que se abra una ventana web durante la ejecución, debe cerrarse automáticamente al terminar su operación usando `mcp_playwright_browser_close`.

## 📋 CONFIGURACIÓN DEL PROYECTO

**WEB TARGET**: `https://qarmy.ar/webs-practicas-testing/`  
**PROYECTO JIRA**: `DEM`  
*← Configuración para análisis de vulnerabilidades web y creación automática de bugs*

**⚠️ RESTRICCIÓN CRÍTICA - ANÁLISIS EXCLUSIVO**: 
- **SOLO ANALIZAR**: La URL designada `https://qarmy.ar/webs-practicas-testing/`
- **PROHIBIDO**: Navegar a cualquier otra URL o aplicación web
- **NO ACCEDER**: A los links listados en la página objetivo (son solo referencias)
- **ENFOQUE**: Analizar únicamente la estructura, formularios y contenido de la página objetivo

### 🔐 CREDENCIALES PARA DEMOSTRACIÓN WEB JIRA
**JIRA LOGIN WEB**: Para la demostración final automatizada en navegador
- **Email**: `jorgediazsp25@gmail.com`
- **Password**: `Macsa2017!`
- **URL**: `https://demojirajorgediaz.atlassian.net`

*← Credenciales para login manual/automatizado en la demostración web final*

---

## 🔄 PROCESO COMPLETAMENTE AUTOMÁTICO DE SECURITY TESTING

- Primero valida accesos con config_clean.ps1 y validate_all_clean.ps1
- Tiene que haber acceso a todo, en caso se pierda acceso a 1 integración no continua el proceso automatizado.

### 1. ANÁLISIS AUTOMÁTICO DE VULNERABILIDADES WEB

**PASO 1**: Navegación y análisis de la web objetivo  
- Acceder a: https://qarmy.ar/webs-practicas-testing/
- Realizar análisis automático de vulnerabilidades usando Playwright
- Detectar problemas de seguridad comunes (XSS, SQL Injection, CSRF, etc.)
- Analizar estructura HTML, formularios, y endpoints

**PASO 2**: Categorización automática de vulnerabilidades encontradas  
- **Críticas**: SQL Injection, XSS Stored, RCE
- **Altas**: XSS Reflected, CSRF, Authentication Bypass
- **Medias**: Information Disclosure, Missing Headers
- **Bajas**: Missing HTTPS, Weak SSL Configuration

⚠️ **REGLAS DE SELECCIÓN OPTIMIZADA PARA DEMOSTRACIÓN**:
- **DETECTAR**: MÁXIMO 1 vulnerabilidad para optimizar tiempo de ejecución
- **PRIORIZAR**: Seleccionar la vulnerabilidad de mayor impacto (Critical o High)
- **CREAR**: 1 bug + 1 test case asociado únicamente
- **CRITERIOS DE SELECCIÓN**: Vulnerabilidad más representativa y de fácil demostración

⚠️ **CONFIGURACIÓN PARA EFICIENCIA**:
- **Límite de vulnerabilidades**: 1 por ejecución
- **Tiempo optimizado**: Proceso completo en <10 minutos
- **Demostración completa**: Bug + Test Case + Comentarios técnicos

### 2. EJECUCIÓN DE SECURITY TESTING

- Ejecuta el análisis de seguridad basado en técnicas OWASP estándar
- **⚠️ CRÍTICO - ADHERENCIA ESTRICTA**: Al momento de crear cada test case, **CEÑIRSE EXACTAMENTE a las técnicas de validación específicas para cada tipo de vulnerabilidad**. NO agregar pasos adicionales, validaciones extra o funcionalidades que no estén específicamente relacionadas con la vulnerabilidad detectada.
- **⚠️ MANDATORIO**: Seguir ÚNICAMENTE los patrones de detección apropiados para cada tipo de vulnerabilidad, sin agregar validaciones o interacciones adicionales
- Realiza testing end-to-end con Playwright:
  - Navegador: Chrome con configuración de seguridad específica
  - **Browser Closure**: Los navegadores se cierran correctamente al final de cada test
  - Validaciones: Inyecciones, autenticación, autorización, configuración
  - Captura de evidencias y validación de resultados

### 3. TRANSICIONES AUTOMÁTICAS EN JIRA

- **BUGS CREADOS**: Transicionar 1 bug a estado apropiado tras validación
- **TEST CASES**: Crear 1 test case asociado al bug automáticamente
- **⚠️ OPTIMIZACIÓN PARA DEMOSTRACIÓN**: Crear estructura mínima en proyecto DEM:
  - 1 vulnerabilidad de mayor impacto: bug creado ✅
  - 1 test case asociado: Listo para ejecución ✅
  - Comentarios técnicos detallados en ambos issues ✅
  - Trazabilidad completa entre bug y test case ✅
- **Estrategia de Eficiencia**: Detectar → Seleccionar la más crítica → Crear bug optimizado
- **Bug Individual**: Mantener trazabilidad completa con test case
- Agregar comentarios con evidencia de detección a cada issue

**IMPORTANTE**: La creación debe ser completamente automática en el proyecto DEM

---

## � ESTRATEGIA DE PRIORIZACIÓN DE VULNERABILIDADES

### **MATRIZ DE PRIORIDADES**

| Tipo de Vulnerabilidad | Prioridad Base | Criterios de Escalación |
|------------------------|----------------|------------------------|
| SQL Injection, XSS Stored, RCE | **CRITICAL** | Siempre máxima prioridad |
| XSS Reflected, CSRF, Auth Bypass | **HIGH** | ⚠️ **MÁXIMO 2 por ejecución** |
| Information Disclosure, Missing Headers | **MEDIUM** | Escalable desde HIGH si hay exceso |
| Missing HTTPS, Weak SSL | **LOW** | Baseline security |

### **REGLAS DE LIMITACIÓN**
1. **Critical**: Sin límite, TODAS las vulnerabilidades críticas se procesan
2. **High**: Se DETECTAN todas, se SELECCIONAN las 2 más impactantes para crear bugs
3. **Medium/Low**: TODAS se procesan y crean bugs
4. **Criterios de selección para las 2 HIGH**: 
   - Puntuación de impacto más alta
   - Facilidad de explotación
   - Exposición externa de la vulnerabilidad
   - Potencial de escalación de privilegios

---

## �🛡️ TÉCNICAS DE DETECCIÓN POR TIPO DE VULNERABILIDAD

### **FASE 1: ANÁLISIS WEB ESTRUCTURADO**
```javascript
// Playwright Security Analysis con técnicas específicas
async function analyzeWebSecurity(targetUrl) {
    await page.goto(targetUrl);
    
    // 1. Detectar formularios para testing de inyección
    const forms = await page.locator('form').all();
    
    // 2. Analizar inputs para XSS
    const inputs = await page.locator('input[type="text"], textarea').all();
    
    // 3. Verificar headers de seguridad
    const response = await page.goto(targetUrl);
    const headers = response.headers();
    
    // 4. Buscar información sensible expuesta
    const sensitiveData = await page.content();
    
    // 5. Analizar autenticación y autorización
    const authElements = await page.locator('input[type="password"], [href*="login"]').all();
    
    return {
        forms,
        inputs, 
        headers,
        sensitiveData,
        authElements
    };
}
```

### **FASE 2: CREACIÓN DE BUGS ESPECÍFICOS**
```powershell
# Detectar y clasificar TODAS las vulnerabilidades
$allVulnerabilities = @()
$criticalVulns = @()
$highVulns = @()
$mediumVulns = @()
$lowVulns = @()

# Clasificar todas las vulnerabilidades detectadas
foreach ($vulnerability in $vulnerabilitiesFound) {
    # Determinar prioridad basada en tipo
    $priority = switch ($vulnerability.Type) {
        {$_ -in @("SQL Injection", "XSS Stored", "RCE")} { "Critical"; $criticalVulns += $vulnerability }
        {$_ -in @("XSS Reflected", "CSRF", "Authentication Bypass")} { "High"; $highVulns += $vulnerability }
        {$_ -in @("Information Disclosure", "Missing Headers")} { "Medium"; $mediumVulns += $vulnerability }
        {$_ -in @("Missing HTTPS", "Weak SSL Configuration")} { "Low"; $lowVulns += $vulnerability }
        default { "Low"; $lowVulns += $vulnerability }
    }
}

# Seleccionar máximo 2 vulnerabilidades HIGH para crear bugs
$selectedHighVulns = $highVulns | Sort-Object -Property @{Expression={$_.ImpactScore}; Descending=$true} | Select-Object -First 2

# Crear lista final de vulnerabilidades para procesar
$vulnerabilitiesToProcess = $criticalVulns + $selectedHighVulns + $mediumVulns + $lowVulns

Write-Host "📊 RESUMEN DE DETECCIÓN:"
Write-Host "- Total detectadas: $($vulnerabilitiesFound.Count)"
Write-Host "- Críticas: $($criticalVulns.Count) (todas incluidas)"
Write-Host "- Altas detectadas: $($highVulns.Count)"
Write-Host "- Altas seleccionadas: $($selectedHighVulns.Count)"
Write-Host "- Medias: $($mediumVulns.Count)"
Write-Host "- Bajas: $($lowVulns.Count)"
Write-Host "- Bugs a crear: $($vulnerabilitiesToProcess.Count)"

# Crear bugs solo para las vulnerabilidades seleccionadas
foreach ($vulnerability in $vulnerabilitiesToProcess) {
    $bugData = @{
        projectKey = "DEM"
        issueTypeName = "Bug"
        summary = "Security: $($vulnerability.Type) - $($vulnerability.Location)"
        priority = $vulnerability.Priority
        description = @"
**TIPO DE VULNERABILIDAD**: $($vulnerability.Type)
**SEVERIDAD**: $($vulnerability.Severity)
**PRIORIDAD ASIGNADA**: $($vulnerability.Priority)
**UBICACIÓN**: $($vulnerability.Location)

**DESCRIPCIÓN TÉCNICA**:
$($vulnerability.TechnicalDescription)

**PASOS PARA REPRODUCIR**:
$($vulnerability.ReproductionSteps)

**IMPACTO**:
$($vulnerability.Impact)

**EVIDENCIA**:
$($vulnerability.Evidence)

**RECOMENDACIÓN**:
$($vulnerability.Recommendation)
"@
    }
    
    # Crear bug usando MCP Atlassian
    $bugCreated = Invoke-MCPAtlassian -Action "createJiraIssue" -Data $bugData
}
```

### **FASE 3: GENERACIÓN DE TEST CASES ESPECÍFICOS**
```powershell
# Para cada bug creado, generar test case con pasos específicos por tipo
foreach ($bug in $bugsCreated) {
    $testSteps = Generate-TestStepsByVulnerabilityType -Type $bug.VulnerabilityType
    
    $testCaseData = @{
        projectKey = "DEM"
        issueTypeName = "Test"
        summary = "Validar corrección: $($bug.VulnerabilityType) en $($bug.Location)"
        description = @"
**OBJETIVO**: Validar que la vulnerabilidad $($bug.VulnerabilityType) ha sido corregida

**PRECONDICIONES**:
- Aplicación web accesible
- Herramientas de testing configuradas
- Navegador actualizado

**PASOS DE EJECUCIÓN**:
$testSteps

**RESULTADO ESPERADO**:
- La vulnerabilidad no debe ser reproducible
- La aplicación debe rechazar payloads maliciosos
- No debe existir exposición de datos sensibles

**CRITERIOS DE ACEPTACIÓN**:
- Payload de ataque debe ser neutralizado
- Respuesta de aplicación debe ser segura
- No debe ocurrir comportamiento no deseado
"@
    }
    
    # Crear test case usando MCP Atlassian
    $testCaseCreated = Invoke-MCPAtlassian -Action "createJiraIssue" -Data $testCaseData
}
```

### **FASE 4: SCRIPTS AUTOMATIZADOS POR VULNERABILIDAD**
```javascript
// Auto-generated scripts específicos por tipo de vulnerabilidad
async function validateVulnerabilityFixed(vulnerabilityType, location, payload) {
    console.log(`Testing ${vulnerabilityType} at ${location}`);
    
    await page.goto(location);
    
    switch(vulnerabilityType) {
        case 'XSS':
            await testXSSFixed(payload);
            break;
        case 'SQLInjection':
            await testSQLInjectionFixed(payload);
            break;
        case 'CSRF':
            await testCSRFFixed();
            break;
        default:
            await genericSecurityTest(payload);
    }
    
    // Capturar evidencia
    await page.screenshot({ 
        path: `evidence_${vulnerabilityType}_${Date.now()}.png`,
        fullPage: true
    });
    
    return {
        status: 'TESTED',
        vulnerabilityType,
        location,
        timestamp: new Date().toISOString()
    };
}

// Función específica para XSS
async function testXSSFixed(payload) {
    const inputs = await page.locator('input[type="text"], textarea').all();
    
    for (let input of inputs) {
        await input.fill(payload);
        await page.keyboard.press('Enter');
        
        // Verificar que el script no se ejecute
        const alertHandled = await page.evaluate(() => {
            return window.alertFired || false;
        });
        
        if (alertHandled) {
            console.log('⚠️ XSS vulnerability still present');
            return false;
        }
    }
    
    console.log('✅ XSS vulnerability appears to be fixed');
    return true;
}

// Función específica para SQL Injection
async function testSQLInjectionFixed(payload) {
    const forms = await page.locator('form').all();
    
    for (let form of forms) {
        const inputs = await form.locator('input').all();
        
        for (let input of inputs) {
            await input.fill(payload);
        }
        
        await form.locator('input[type="submit"], button[type="submit"]').click();
        
        // Verificar respuesta por errores SQL
        const content = await page.content();
        const sqlErrors = [
            'mysql_fetch_array',
            'ORA-',
            'Microsoft OLE DB',
            'syntax error',
            'postgresql'
        ];
        
        const hasError = sqlErrors.some(error => 
            content.toLowerCase().includes(error.toLowerCase())
        );
        
        if (hasError) {
            console.log('⚠️ SQL Injection vulnerability detected');
            return false;
        }
    }
    
    console.log('✅ SQL Injection vulnerability appears to be fixed');
    return true;
}
```

---

## 📊 ESTRUCTURA DE AUTOMATIZACIÓN

```powershell
# CONFIGURACIÓN CENTRALIZADA PARA SECURITY TESTING
. .\config_clean.ps1

# VARIABLES DE SECURITY TESTING
$TARGET_URL = "https://qarmy.ar/webs-practicas-testing/"
$JIRA_PROJECT = "DEM"
$VULNERABILITY_TYPES = @(
    "SQL_Injection",
    "XSS_Reflected", 
    "XSS_Stored",
    "CSRF",
    "Authentication_Bypass",
    "Information_Disclosure",
    "Security_Misconfiguration",
    "Broken_Access_Control"
)

# PROCESO AUTOMATIZADO
# 1. Análisis web con Playwright
# 2. Detección de vulnerabilidades
# 3. Creación automática de bugs en Jira
# 4. Generación de test cases
# 5. Scripts de validación automatizados
```

---

## 🤖 WORKFLOW AUTOMATIZADO DE 6 FASES - SIN CAMBIOS DE VISTA

**PROCESO COMPLETAMENTE SILENCIOSO**: Eres un **Security Test Engineer** especializado en análisis de vulnerabilidades web con Playwright MCP y gestión de bugs/test cases en Jira. Tu objetivo es automatizar completamente el ciclo de security testing: desde la detección de vulnerabilidades hasta la creación de bugs y test cases **SIN CAMBIAR LA VISTA DEL IDE**.

### **RESPONSABILIDADES PRINCIPALES (MODO SILENCIOSO)**:

1. **Análisis de Vulnerabilidades Dinámico (MODO SILENCIOSO)**:
   - Conectar a Atlassian usando MCP (sin terminal)
   - **⚠️ CRÍTICO**: Analizar ÚNICAMENTE `https://qarmy.ar/webs-practicas-testing/` usando `mcp_playwright_browser_*`
   - **PROHIBIDO**: Navegar a cualquier URL externa o aplicación referenciada en la página
   - **ENFOQUE**: Detectar vulnerabilidades en la propia página objetivo (formularios, headers, estructura HTML)
   - Clasificar por criticidad y tipo

2. **Creación de Issues Escalable (SIN CAMBIOS DE VISTA)**:
   - Crear bugs Jira dinámicos usando SOLO `mcp_atlassian_createJiraIssue`
   - **⚠️ MANDATORIO**: Seguir ÚNICAMENTE los patrones específicos para cada tipo de vulnerabilidad
   - Crear automáticamente TODOS los bugs encontrados (1, 5, 10, 50...)
   - **IMPORTANTE**: Usar solo herramientas MCP Browser para navegación
   - Capturar evidencias y resultados para todas las vulnerabilidades

3. **Generación Test Cases Completa (PROCESO SILENCIOSO)**:
   - **SOLO crear test cases** usando `mcp_atlassian_createJiraIssue` asociados a bugs
   - Usar EXACTAMENTE las credenciales verificadas del `config_clean.ps1`
   - **EJECUTAR análisis web** usando herramientas MCP Browser
   - Crear TODOS los test cases encontrados con pasos específicos

4. **Comentario y Finalización del Análisis (HERRAMIENTAS MCP ONLY)** ⭐:
   - **Agregar comentario**: Usar SOLO `mcp_atlassian_addCommentToJiraIssue`
   - **Contenido del comentario**: Resumen de vulnerabilidad, impacto, evidencias, recomendaciones
   - **Verificación**: Usar `mcp_atlassian_getJiraIssue` para confirmar bugs y test cases
   - Documentar usando `create_file` y `replace_string_in_file`

5. **Scripts de Validación Automatizados (SIN TERMINAL)**:
   - Generar scripts usando `create_file` con código Playwright
   - Scripts deben poder ejecutarse independientemente
   - Validar que la vulnerabilidad puede reproducirse usando MCP Browser
   - Capturar evidencias automatizadas con MCP

6. **Transiciones y Estados Finales (MODO SILENCIOSO)**:
   - Bugs: Estado "Open" usando `mcp_atlassian_editJiraIssue`
   - Test Cases: Estado "Ready" para ejecución
   - Scripts: Generados con `create_file` y documentados
   - Evidencias: Capturadas con MCP Browser y organizadas

### CONFIGURACIÓN ESPECÍFICA (MODO SILENCIOSO):

```powershell
# Variables que se extraen automáticamente desde el análisis web
$TARGET_URL = "https://qarmy.ar/webs-practicas-testing/"           # Web objetivo EXCLUSIVA (NO navegar a otras URLs)
$JIRA_PROJECT = "DEM"                                              # Proyecto Jira fijo
$VULNERABILITIES_FOUND = @()                                       # Array dinámico con TODAS las vulnerabilidades
$BUGS_CREATED = @()                                                # Array con bugs creados automáticamente
$TEST_CASES_GENERATED = @()                                        # Array con test cases generados

# 🤖 PROCESO AUTOMÁTICO DE SECURITY TESTING (SIN CAMBIOS DE VISTA):
# 1. Analizar ÚNICAMENTE la web objetivo usando mcp_playwright_browser_navigate
# 2. NO ACCEDER a URLs externas o aplicaciones referenciadas
# 3. Crear bugs en Jira usando mcp_atlassian_createJiraIssue
# 4. Generar test cases usando mcp_atlassian_createJiraIssue
# 5. Crear scripts usando create_file (NO run_in_terminal)
# 6. Agregar comentarios usando mcp_atlassian_addCommentToJiraIssue
# 7. Documentar usando replace_string_in_file

# HERRAMIENTAS PROHIBIDAS: run_in_terminal, get_terminal_output, terminal_*
# HERRAMIENTAS PERMITIDAS: mcp_atlassian_*, mcp_playwright_browser_*, create_file, read_file
# NAVEGACIÓN PROHIBIDA: Cualquier URL que no sea https://qarmy.ar/webs-practicas-testing/
```

### ⚠️ VALIDACIONES CRÍTICAS (PROCESO SILENCIOSO):

- ✅ **Detección dinámica** - NO hardcodear vulnerabilidades específicas
- ✅ **CREAR bugs nuevos** - Usar SOLO `mcp_atlassian_createJiraIssue`
- ✅ **Escalar automáticamente** - soportar 1, 5, 10 o más vulnerabilidades
- ✅ **ADHERENCIA ESTRICTA AL TIPO DE VULNERABILIDAD** - Crear test cases con pasos específicos
- ✅ **Crear issues completos** - TODOS los bugs y test cases usando MCP
- ✅ **Browser MCP dinámico** - usar `mcp_playwright_browser_*` exclusivamente
- ✅ **NO CAMBIAR VISTA DEL IDE** - mantener editor actual
- ✅ **Documentación con archivos** - usar `create_file` y `replace_string_in_file`
- ✅ **COMENTARIO EN CADA BUG** - usar `mcp_atlassian_addCommentToJiraIssue`
- ✅ **SCRIPTS FUNCIONALES** - generar con `create_file` (NO ejecutar)
- ✅ **TRAZABILIDAD COMPLETA** - Bug → Test Case → Script de validación

**HERRAMIENTAS PROHIBIDAS**: `run_in_terminal`, `get_terminal_output`, `terminal_*`, `create_and_run_task`

### 🔧 INTEGRACIÓN JIRA/ATLASSIAN AUTOMÁTICA (SIN TERMINAL)

**⚠️ CRÍTICO**: **CREAR NUEVOS BUGS Y TEST CASES** usando SOLO herramientas MCP

**PASO OBLIGATORIO**: Crear automáticamente TODOS los bugs y test cases usando MCP:

```javascript
// Análisis de seguridad SILENCIOSO usando MCP Browser
// NO usar run_in_terminal - SOLO mcp_playwright_browser_*

// 1. NAVEGACIÓN WEB CON MCP BROWSER
await mcp_playwright_browser_navigate(TARGET_URL)
await mcp_playwright_browser_snapshot()
const vulnerabilities = await detectVulnerabilities()

// 2. CREACIÓN AUTOMÁTICA DE BUGS CON MCP ATLASSIAN
for (const vulnerability of vulnerabilities) {
    const bugData = {
        projectKey: "DEM",
        issueTypeName: "Bug", 
        summary: `Security: ${vulnerability.title}`,
        description: vulnerability.detailedDescription
        // Usar mcp_atlassian_createJiraIssue
    }
}

// 3. CREACIÓN AUTOMÁTICA DE TEST CASES CON MCP
for (const bug of bugsCreated) {
    const testCaseData = {
        projectKey: "DEM",
        issueTypeName: "Test",
        summary: `Test: Validar ${bug.vulnerabilityType}`,
        description: bug.testSteps
        // Usar mcp_atlassian_createJiraIssue
    }
}

// 4. GENERACIÓN DE SCRIPTS CON create_file (NO EJECUTAR)
for (const testCase of testCases) {
    // Usar create_file para generar scripts Playwright
    // NO usar run_in_terminal para ejecutar
}
```

**HERRAMIENTAS REQUERIDAS**:
- ✅ `mcp_atlassian_createJiraIssue` - Crear bugs y test cases
- ✅ `mcp_playwright_browser_navigate` - Análisis web
- ✅ `mcp_playwright_browser_snapshot` - Captura de evidencias  
- ✅ `create_file` - Generar scripts
- ✅ `mcp_atlassian_addCommentToJiraIssue` - Comentarios

**HERRAMIENTAS PROHIBIDAS**:
- 🚫 `run_in_terminal` - NO usar
- 🚫 `get_terminal_output` - NO usar
- 🚫 `terminal_*` - NO usar

---

## 🚀 EJECUCIÓN DEL SECURITY TESTING (PROCESO SILENCIOSO)

**Comando**: Ejecutar análisis completo de seguridad SIN CAMBIAR VISTA DEL IDE:

```
## 📊 COMANDO DE EJECUCIÓN AUTOMATIZADA (MODO SILENCIOSO)

**INSTRUCCIÓN PRINCIPAL**: Ejecutar análisis completo de vulnerabilidades para https://qarmy.ar/webs-practicas-testing/ y crear bugs/test cases automáticamente en proyecto DEM **MANTENIENDO LA VISTA ACTUAL DEL EDITOR**

**HERRAMIENTAS PERMITIDAS EXCLUSIVAMENTE**:
- mcp_atlassian_* (para gestión Jira)
- mcp_playwright_browser_* (para análisis web)  
- create_file (para generar scripts)
- read_file (para configuración)
- manage_todo_list (para seguimiento)

**HERRAMIENTAS PROHIBIDAS**:
- run_in_terminal
- get_terminal_output
- terminal_*
- create_and_run_task

El agente ejecutará automáticamente SIN CAMBIAR LA VISTA:
1. Análisis web estructurado con MCP Playwright Browser
2. Detección de vulnerabilidades OWASP Top 10
3. Creación automática de bugs usando mcp_atlassian_createJiraIssue
4. Generación automática de test cases con mcp_atlassian_createJiraIssue
5. Scripts de validación generados con create_file
6. Documentación completa usando replace_string_in_file
```

## 🔄 FLUJO DE EJECUCIÓN COMPLETO

### **FASE 1: PREPARACIÓN** ⚙️
```powershell
# Configurar credenciales y herramientas
. .\config_clean.ps1
Initialize-SecurityTestingEnvironment
```

### **FASE 2: ANÁLISIS WEB** 🔍
```javascript
// Playwright - Análisis estructurado de seguridad
const securityAnalysis = await analyzeWebSecurity('https://qarmy.ar/webs-practicas-testing/');
const vulnerabilities = await detectVulnerabilities(securityAnalysis);
```

### **FASE 3: CREACIÓN DE BUGS** 🐛
```powershell
# Para cada vulnerabilidad - crear bug específico en Jira
foreach ($vuln in $vulnerabilities) {
    Create-SecurityBug -ProjectKey "DEM" -Vulnerability $vuln
}
```

### **FASE 4: GENERACIÓN DE TEST CASES** ✅
```powershell
# Para cada bug - crear test case de validación
foreach ($bug in $bugsCreated) {
    Create-ValidationTestCase -ProjectKey "DEM" -Bug $bug
}
```

### **FASE 5: SCRIPTS AUTOMATIZADOS** 🤖
```javascript
// Generar scripts de validación personalizados
for (let testCase of testCases) {
    await generateValidationScript(testCase);
}
```

### **FASE 6: DOCUMENTACIÓN** 📋
```powershell
# Generar reporte completo y actualizar repositorio
Generate-SecurityReport -Bugs $bugs -TestCases $testCases
Update-Repository -ReportPath $reportPath
```

---

## 🎯 RESULTADO FINAL ESPERADO

Al ejecutar este prompt, el agente generará automáticamente:

1. **Bugs en Jira (Proyecto DEM)**: Uno por cada vulnerabilidad encontrada con evidencia técnica
2. **Test Cases en Jira**: Scripts de validación para verificar correcciones
3. **Scripts de automatización**: Código Playwright para validación continua
4. **Reporte de seguridad**: Documentación completa en repositorio
5. **Evidencia visual**: Screenshots y logs de cada vulnerabilidad

### **Tiempo estimado**: 15-30 minutos
### **Cobertura**: OWASP Top 10 completo
### **Automatización**: 100% integrada con Jira y Git"
```

El sistema automáticamente:
1. 🔍 Analiza la web objetivo en busca de vulnerabilidades
2. 🐛 Crea bugs en Jira proyecto DEM para cada vulnerabilidad  
3. 🧪 Genera test cases asociados para validación
4. 🤖 Crea scripts de automatización funcionales
5. 📊 Documenta completamente el proceso con evidencias

**Resultado**: Análisis de seguridad completamente automatizado con creación de bugs, test cases y scripts de validación en Jira.

---

## ⚠️ IMPORTANTE - BUENAS PRÁCTICAS APLICADAS

### Diferencias clave con análisis manuales:

1. **Browser Closure**: Los navegadores se cierran correctamente después del análisis
2. **Bugs Nuevos**: CREAR nuevos bugs en DEM - NO usar issues existentes  
3. **Creación Automática**: Los bugs y test cases DEBEN crearse automáticamente
4. **Trazabilidad**: Mantener conexión clara Bug → Test Case → Script
5. **Credenciales Verificadas**: Usa las credenciales del config_clean.ps1 validadas

### 🔧 RESOLUCIÓN DE PROBLEMAS ESPECÍFICOS:

**PROBLEMA 1**: "No se detectan vulnerabilidades"
- ✅ **SOLUCIÓN**: Ampliar técnicas de análisis y usar múltiples vectores de ataque
- ✅ **VERIFICACIÓN**: Confirmar que el análisis cubra OWASP Top 10 completo

**PROBLEMA 2**: "Bugs no se crean en Jira"
- ✅ **SOLUCIÓN**: Verificar credenciales MCP Atlassian y permisos de creación
- ✅ **ENDPOINT CORRECTO**: Usar `mcp_atlassian_createJiraIssue` con projectKey="DEM"

**PROBLEMA 3**: "Test cases muy genéricos"
- ✅ **CAUSA**: Falta de especificidad en pasos de validación por tipo de vulnerabilidad
- ✅ **SOLUCIÓN**: Incluir pasos exactos, payloads específicos, y validaciones concretas

**PROBLEMA 4**: "Scripts no son ejecutables"
- ✅ **CAUSA**: Falta de estructura apropiada de Playwright
- ✅ **SOLUCIÓN**: Generar código funcional con navegación, interacción, y validación

**PROBLEMA 5**: "Falta documentación en bugs"
- ✅ **CAUSA**: No agregar comentarios descriptivos al crear los issues
- ✅ **SOLUCIÓN**: Usar `mcp_atlassian_addCommentToJiraIssue` con evidencias detalladas

---

## 📝 TEMPLATE DE BUG REPORT

```markdown
**RESUMEN**: [Tipo de Vulnerabilidad] - [Ubicación/Endpoint]

**DESCRIPCIÓN DETALLADA**:
**Tipo de Vulnerabilidad**: [SQL Injection/XSS/CSRF/etc.]
**Severidad**: [Critical/High/Medium/Low]
**Vector de Ataque**: [GET/POST/Cookie/Header]
**Endpoint Afectado**: [URL específica]

**PASOS PARA REPRODUCIR**:
1. Navegar a [URL]
2. Introducir payload: [payload específico]
3. Observar comportamiento: [resultado]

**IMPACTO**:
- [Descripción del impacto en seguridad]
- [Datos que podrían comprometerse]
- [Acceso no autorizado posible]

**EVIDENCIA**:
- Screenshot: [nombre_archivo]
- Request/Response: [detalles técnicos]

**RECOMENDACIÓN**:
- [Solución específica sugerida]
- [Mejores prácticas a implementar]
```

---

## 🌐 DEMOSTRACIÓN WEB FINAL AUTOMATIZADA

### **PASO FINAL: NAVEGACIÓN Y DEMOSTRACIÓN EN JIRA**

Al completar todo el proceso de security testing automatizado, el sistema debe:

**1. ABRIR JIRA WEB AUTOMÁTICAMENTE**
- Usar Playwright MCP Browser para abrir: `https://demojirajorgediaz.atlassian.net`
- Navegar automáticamente al proyecto DEM
- Buscar y acceder al primer bug creado durante el análisis (ej: DEM-13 o el más reciente)

**2. DEMOSTRAR BUG CREADO**
- Hacer scroll down en la página del bug para mostrar la descripción completa
- Capturar evidencia de la descripción detallada del bug
- Mostrar los campos: Summary, Description, Priority, Type
- Demostrar la evidencia técnica y pasos de reproducción

**3. NAVEGAR AL TEST CASE ASOCIADO**
- Desde el bug, seguir el enlace al test case asociado (ej: DEM-16)
- O navegar directamente al test case correspondiente
- Hacer scroll down para mostrar los pasos detallados del test case
- **CRÍTICO**: Navegar a la sección de comentarios y hacer scroll completo para visualizar comentarios técnicos

**4. DEMOSTRAR TEST CASE CREADO**
- Mostrar la estructura completa del test case
- Evidenciar la conexión entre bug → test case
- Demostrar los pasos específicos de validación
- Mostrar criterios de aceptación y evidencia requerida
- **OBLIGATORIO**: Acceder a los comentarios del test case y hacer scroll para mostrar comentarios técnicos con evidencia completa

### **IMPLEMENTACIÓN TÉCNICA:**

```javascript
// Navegación automática final en Jira
async function demostracionFinalJira() {
    // 1. Abrir Jira y navegar al proyecto
    await page.goto('https://demojirajorgediaz.atlassian.net/browse/DEM');
    
    // 2. Buscar el bug más reciente creado
    const ultimoBug = await obtenerUltimoBugCreado();
    await page.goto(`https://demojirajorgediaz.atlassian.net/browse/${ultimoBug}`);
    
    // 3. Scroll y demostrar descripción del bug
    await page.waitForSelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]');
    await scrollYMostrarContenido('Bug Description');
    
    // 4. Navegar a comentarios del bug y hacer scroll completo
    await navegarAComentariosYMostrar('Bug Comments');
    
    // 5. Encontrar test case asociado
    const testCaseAsociado = await extraerTestCaseAsociado();
    
    // 6. Navegar al test case
    await page.goto(`https://demojirajorgediaz.atlassian.net/browse/${testCaseAsociado}`);
    
    // 7. Scroll y demostrar test case
    await scrollYMostrarContenido('Test Case Details');
    
    // 8. OBLIGATORIO: Navegar a comentarios del test case y hacer scroll completo
    await navegarAComentariosYMostrar('Test Case Comments');
    
    console.log('✅ DEMOSTRACIÓN JIRA COMPLETADA');
    console.log(`📋 Bug mostrado: ${ultimoBug}`);
    console.log(`🧪 Test Case mostrado: ${testCaseAsociado}`);
    console.log(`💬 Comentarios técnicos visualizados completamente`);
}

// Función para navegar a comentarios y hacer scroll completo
async function navegarAComentariosYMostrar(context) {
    // Buscar sección de comentarios
    await page.locator('#issue-comment-section, [data-testid="issue.activity.comment"], .activity-comment').scrollIntoViewIfNeeded();
    
    // IMPLEMENTACIÓN ROBUSTA DE SCROLL - Probada exitosamente
    await page.evaluate(() => {
        // Método 1: Scroll inteligente hacia los comentarios
        const commentSection = document.querySelector('[data-testid="issue.activity.comment"]') || 
                              document.querySelector('.activity-comment') ||
                              document.querySelector('[role="main"]');
        if (commentSection) {
            commentSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            // Método 2: Scroll hacia el final de la página
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        // Método 3: Scroll adicional para asegurar visibilidad completa
        setTimeout(() => {
            const allComments = document.querySelectorAll('.activity-comment, [data-testid="issue.activity.comment"]');
            if (allComments.length > 0) {
                const lastComment = allComments[allComments.length - 1];
                lastComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1000);
        
        return 'Scroll optimizado ejecutado exitosamente';
    });
    
    // Pausa para visualización completa y captura de evidencia
    await page.waitForTimeout(3000);
    
    // CAPTURA DE EVIDENCIA VISUAL OBLIGATORIA
    await page.screenshot({
        fullPage: true,
        path: `jira-${context.toLowerCase().replace(/\s+/g, '-')}-complete-scroll.png`
    });
    
    console.log(`✅ ${context} - Comentarios técnicos completamente visualizados con scroll optimizado`);
    console.log(`📸 Screenshot capturado: jira-${context.toLowerCase().replace(/\s+/g, '-')}-complete-scroll.png`);
}
```

### **RESULTADO ESPERADO:**

Al final del proceso completo, el usuario verá:

1. ✅ **Análisis de seguridad completado**
2. ✅ **1 bug creado automáticamente en Jira** (optimizado para demostración)
3. ✅ **1 test case generado y vinculado**
4. ✅ **Scripts de validación listos**
5. 🌐 **Navegación web automática mostrando:**
   - Descripción completa del bug en Jira
   - Comentarios técnicos del bug con evidencia completa
   - Detalles del test case asociado
   - Comentarios técnicos del test case con pasos específicos
   - Evidencia visual de la trazabilidad completa con scroll en comentarios

### **VALOR AGREGADO:**
- **Demostración Visual**: Ver el resultado tangible en Jira
- **Validación Inmediata**: Confirmar que todo se creó correctamente
- **Trazabilidad Completa**: Evidenciar la conexión bug ↔ test case
- **Presentación Profesional**: Mostrar el trabajo completado

---

## 🎯 OBJETIVOS DEL SECURITY TESTING AUTOMATIZADO

1. **Detección Proactiva**: Identificar vulnerabilidades antes de que sean explotadas
2. **Documentación Completa**: Crear registro detallado en Jira para seguimiento
3. **Validación Automatizada**: Scripts que permitan verificar correcciones
4. **Trazabilidad**: Conexión clara entre vulnerabilidad → bug → test case → script
5. **Eficiencia**: Proceso completamente automatizado sin intervención manual
6. **Cobertura**: Análisis exhaustivo siguiendo estándares OWASP
7. **Demostración Visual**: Navegación automática en Jira para mostrar resultados

**El sistema debe ser capaz de ejecutar un análisis de seguridad completo, generar automáticamente toda la documentación y scripts de validación necesarios, y finalizar con una demostración web que muestre los resultados tangibles en Jira.**

---

## 🔧 TÉCNICA AVANZADA DE SCROLL EN JIRA

### **PROBLEMA IDENTIFICADO**: 
Durante la demostración web, es crítico que el contenido de los comentarios técnicos sea completamente visible para evidenciar el trabajo realizado.

### **SOLUCIÓN IMPLEMENTADA Y PROBADA**:

```javascript
// TÉCNICA DE SCROLL ROBUSTA PARA JIRA - VALIDADA EXITOSAMENTE
async function scrollOptimizadoJira() {
    const scrollResult = await page.evaluate(() => {
        // Método 1: Búsqueda inteligente de sección de comentarios
        const commentSection = document.querySelector('[data-testid="issue.activity.comment"]') || 
                              document.querySelector('.activity-comment') ||
                              document.querySelector('[role="main"]');
        
        if (commentSection) {
            // Scroll suave hacia el final de los comentarios
            commentSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            // Fallback: Scroll hacia el final de toda la página
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        return 'Scroll ejecutado exitosamente hacia comentarios técnicos';
    });
    
    // Esperar a que el scroll termine
    await page.waitForTimeout(2000);
    
    // Captura obligatoria de evidencia visual
    await page.screenshot({
        fullPage: true,
        path: `jira-scroll-evidence-${Date.now()}.png`
    });
    
    return scrollResult;
}
```

### **BENEFICIOS VALIDADOS**:
- ✅ **Scroll Automático**: Navega automáticamente a la sección de comentarios
- ✅ **Contenido Visible**: Asegura que todo el contenido técnico sea visible
- ✅ **Evidencia Visual**: Captura screenshots del contenido completo
- ✅ **Demostración Efectiva**: Permite mostrar visualmente el trabajo completado
- ✅ **Múltiples Fallbacks**: Funciona con diferentes versiones de Jira

### **IMPLEMENTACIÓN EN EL PROCESO**:
Esta técnica debe aplicarse automáticamente durante la **FASE 6: DEMOSTRACIÓN WEB FINAL** para garantizar que toda la evidencia técnica (bugs, test cases, comentarios, scripts) sea completamente visible durante la presentación de resultados.

**RESULTADO**: Demostración visual completa y profesional del análisis de seguridad automatizado con evidencia fotográfica del contenido técnico generado.