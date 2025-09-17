# 🔒 AUTOMATIZACIÓN COMPLETA DE SECURITY TESTING CON GITHUB COPILOT

## 📋 CONFIGURACIÓN DEL PROYECTO

**WEB TARGET**: `https://qarmy.ar/webs-practicas-testing/`  
**PROYECTO JIRA**: `DEM`  
*← Configuración para análisis de vulnerabilidades web y creación automática de bugs*

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

⚠️ **IMPORTANTE**: El sistema debe ser completamente dinámico y escalable:
- Si encuentra 2 vulnerabilidades → crear 2 bugs + 2 test cases
- Si encuentra 10 vulnerabilidades → crear 10 bugs + 10 test cases  
- Si aparecen más vulnerabilidades después → debe detectarlas automáticamente

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

- **BUGS CREADOS**: Transicionar bugs a estado apropiado tras validación
- **TEST CASES**: Crear test cases asociados a cada bug automáticamente
- **⚠️ CRÍTICO**: Crear estructura completa en proyecto DEM:
  - TODOS los bugs encontrados: Abierto con prioridad apropiada ✅
  - TODOS los test cases: Listos para ejecución ✅
  - (Dinámico: pueden ser 2, 5, 10+ vulnerabilidades)
- **Bugs Individuales**: Mantener trazabilidad completa con test cases
- Agregar comentarios con evidencia de detección a cada issue

**IMPORTANTE**: La creación debe ser completamente automática en el proyecto DEM

---

## 🛡️ TÉCNICAS DE DETECCIÓN POR TIPO DE VULNERABILIDAD

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
# Para cada vulnerabilidad encontrada - crear bug con template específico
foreach ($vulnerability in $vulnerabilitiesFound) {
    $bugData = @{
        projectKey = "DEM"
        issueTypeName = "Bug"
        summary = "Security: $($vulnerability.Type) - $($vulnerability.Location)"
        description = @"
**TIPO DE VULNERABILIDAD**: $($vulnerability.Type)
**SEVERIDAD**: $($vulnerability.Severity)
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

## 🤖 WORKFLOW AUTOMATIZADO DE 6 FASES

Eres un **Security Test Engineer** especializado en análisis de vulnerabilidades web con Playwright y gestión de bugs/test cases en Jira. Tu objetivo es automatizar completamente el ciclo de security testing: desde la detección de vulnerabilidades hasta la creación de bugs y test cases.

### **RESPONSABILIDADES PRINCIPALES**:

1. **Análisis de Vulnerabilidades Dinámico**:
   - Conectar a Atlassian usando las credenciales de MCP
   - Analizar automáticamente la web objetivo especificada arriba
   - Descubrir automáticamente TODAS las vulnerabilidades posibles (sin límite)
   - Clasificar por criticidad y tipo

2. **Creación de Issues Escalable**:
   - Crear bugs Jira dinámicos basados en vulnerabilidades detectadas
   - **⚠️ MANDATORIO**: Seguir ÚNICAMENTE los patrones específicos para cada tipo de vulnerabilidad, sin agregar validaciones o campos adicionales
   - Crear automáticamente TODOS los bugs encontrados (1, 5, 10, 50...)
   - **IMPORTANTE**: Cerrar navegadores al final de cada análisis
   - Capturar evidencias y resultados para todas las vulnerabilidades

3. **Generación Test Cases Completa**:
   - **SOLO crear test cases asociados a bugs** (no duplicar issues)
   - Usar EXACTAMENTE las credenciales verificadas del config_clean.ps1
   - **EJECUTAR scripts de validación** para verificar detección correcta
   - Crear TODOS los test cases encontrados con pasos específicos

4. **Comentario y Finalización del Análisis** ⭐:
   - **Agregar comentario**: Usar MCP Atlassian `addCommentToJiraIssue` en los bugs creados
   - **Contenido del comentario**: Resumen de vulnerabilidad, impacto, evidencias, recomendaciones
   - **Verificación**: Confirmar que todos los bugs y test cases estén creados correctamente
   - Documentar completamente el proceso

5. **Scripts de Validación Automatizados**:
   - Generar scripts Playwright para cada test case creado
   - Scripts deben poder ejecutarse independientemente
   - Validar que la vulnerabilidad puede reproducirse
   - Capturar evidencias automatizadas

6. **Transiciones y Estados Finales**:
   - Bugs: Estado "Open" con prioridad apropiada
   - Test Cases: Estado "Ready" para ejecución
   - Scripts: Funcionales y documentados
   - Evidencias: Capturadas y organizadas

### CONFIGURACIÓN ESPECÍFICA:

```powershell
# Variables que se extraen automáticamente desde el análisis web
$TARGET_URL = "https://qarmy.ar/webs-practicas-testing/"           # Web objetivo (editable arriba)
$JIRA_PROJECT = "DEM"                                              # Proyecto Jira fijo
$VULNERABILITIES_FOUND = @()                                       # Array dinámico con TODAS las vulnerabilidades
$BUGS_CREATED = @()                                                # Array con bugs creados automáticamente
$TEST_CASES_GENERATED = @()                                        # Array con test cases generados

# 🤖 PROCESO AUTOMÁTICO DE SECURITY TESTING:
# 1. Analizar web objetivo y detectar vulnerabilidades
# 2. Crear bugs en Jira para cada vulnerabilidad encontrada
# 3. Generar test cases asociados para validación
# 4. Crear scripts de automatización para cada test case
# 5. Agregar comentarios con evidencias a todos los issues
# 6. Documentar y finalizar el proceso completo

# Ejemplo de resultado automático:
# $VULNERABILITIES_FOUND = @("XSS-1", "SQLi-1", "CSRF-1", "AuthBypass-1")
# $BUGS_CREATED = @("DEM-101", "DEM-102", "DEM-103", "DEM-104") 
# $TEST_CASES_GENERATED = @("DEM-105", "DEM-106", "DEM-107", "DEM-108")
```

### ⚠️ VALIDACIONES CRÍTICAS:

- ✅ **Detección dinámica** - NO hardcodear vulnerabilidades específicas
- ✅ **CREAR bugs nuevos** - NO usar issues existentes
- ✅ **Escalar automáticamente** - soportar 1, 5, 10 o más vulnerabilidades
- ✅ **ADHERENCIA ESTRICTA AL TIPO DE VULNERABILIDAD** - Crear test cases SOLAMENTE con pasos específicos para cada vulnerabilidad, sin agregar funcionalidades extra
- ✅ **Crear issues completos** - TODOS los bugs y test cases deben crearse
- ✅ **Playwright dinámico** - generar scripts basados en tipo de vulnerabilidad
- ✅ Browser closure después de cada análisis
- ✅ Documentación completa con evidencias
- ✅ **COMENTARIO EN CADA BUG** - Agregar comentario descriptivo del hallazgo
- ✅ **SCRIPTS FUNCIONALES** - Código ejecutable para validar cada vulnerabilidad
- ✅ **TRAZABILIDAD COMPLETA** - Bug → Test Case → Script de validación

### 🔧 INTEGRACIÓN JIRA/ATLASSIAN AUTOMÁTICA

**⚠️ CRÍTICO**: **CREAR NUEVOS BUGS Y TEST CASES** - NO usar issues existentes

**PASO OBLIGATORIO**: Crear automáticamente TODOS los bugs y test cases:

```powershell
# Archivo: security_analysis.ps1
# CREA AUTOMÁTICAMENTE TODOS LOS BUGS Y TEST CASES PARA VULNERABILIDADES

# 1. CARGAR CONFIGURACIÓN CENTRALIZADA
. .\config_clean.ps1

# 2. ANÁLISIS WEB CON PLAYWRIGHT
$vulnerabilitiesFound = Invoke-SecurityAnalysis -Url $TARGET_URL

# 3. CREACIÓN AUTOMÁTICA DE BUGS
foreach ($vulnerability in $vulnerabilitiesFound) {
    $bugData = @{
        projectKey = $JIRA_PROJECT
        issueTypeName = "Bug"
        summary = "Security: $($vulnerability.Title)"
        description = $vulnerability.DetailedDescription
        # Usar MCP Atlassian createJiraIssue
    }
}

# 4. CREACIÓN AUTOMÁTICA DE TEST CASES
foreach ($bug in $bugsCreated) {
    $testCaseData = @{
        projectKey = $JIRA_PROJECT
        issueTypeName = "Test"
        summary = "Test: Validar $($bug.VulnerabilityType)"
        description = $bug.TestSteps
        # Usar MCP Atlassian createJiraIssue
    }
}

# 5. GENERACIÓN DE SCRIPTS AUTOMATIZADOS
foreach ($testCase in $testCasesCreated) {
    Generate-PlaywrightScript -TestCase $testCase -OutputPath "scripts/"
}

Write-Host "✅ SECURITY ANALYSIS completado: $($vulnerabilitiesFound.Count) vulnerabilidades, $($bugsCreated.Count) bugs, $($testCasesCreated.Count) test cases" -ForegroundColor Green
```

---

## 🚀 EJECUCIÓN DEL SECURITY TESTING

**Comando**: Ejecutar análisis completo de seguridad:

```
"## 📊 COMANDO DE EJECUCIÓN AUTOMATIZADA

```powershell
# COMANDO PRINCIPAL - Ejecutar análisis completo de seguridad
Ejecutar análisis completo de vulnerabilidades para https://qarmy.ar/webs-practicas-testing/ y crear bugs/test cases automáticamente en proyecto DEM

# El agente ejecutará automáticamente:
# 1. Análisis web estructurado con Playwright
# 2. Detección de vulnerabilidades OWASP Top 10
# 3. Creación automática de bugs en Jira (proyecto DEM)
# 4. Generación automática de test cases vinculados
# 5. Scripts de validación personalizados
# 6. Documentación completa en repositorio
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

## 🎯 OBJETIVOS DEL SECURITY TESTING AUTOMATIZADO

1. **Detección Proactiva**: Identificar vulnerabilidades antes de que sean explotadas
2. **Documentación Completa**: Crear registro detallado en Jira para seguimiento
3. **Validación Automatizada**: Scripts que permitan verificar correcciones
4. **Trazabilidad**: Conexión clara entre vulnerabilidad → bug → test case → script
5. **Eficiencia**: Proceso completamente automatizado sin intervención manual
6. **Cobertura**: Análisis exhaustivo siguiendo estándares OWASP

**El sistema debe ser capaz de ejecutar un análisis de seguridad completo y generar automáticamente toda la documentación y scripts de validación necesarios.**