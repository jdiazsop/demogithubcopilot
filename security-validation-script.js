// SECURITY VALIDATION SCRIPT - STORED XSS TESTING
// Bug: DEM-45 | Test Case: DEM-46
// Target: Google Gruyere Application
// Vulnerability: Stored XSS in User Registration

const { chromium } = require('playwright');

async function validateStoredXSSVulnerability() {
    console.log('🔒 INICIANDO VALIDACIÓN DE VULNERABILIDAD STORED XSS');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // 1. Navegar a la aplicación vulnerable
        console.log('📍 Navegando a Google Gruyere...');
        await page.goto('https://google-gruyere.appspot.com/start');
        
        // 2. Iniciar instancia
        await page.click('text=Agree & Start');
        
        // 3. Ir a registro
        await page.click('text=Sign up');
        
        // 4. Intentar inyectar payload XSS
        const xssPayload = '<script>alert("XSS-Test-' + Date.now() + '")</script>';
        console.log(`🚨 Probando payload XSS: ${xssPayload}`);
        
        await page.fill('input[name="uid"]', xssPayload);
        await page.fill('input[name="pw"]', 'testpassword');
        await page.click('text=Create account');
        
        // 5. Verificar si el payload se ejecuta o se muestra sin escape
        await page.waitForTimeout(2000);
        
        const pageContent = await page.content();
        const isVulnerable = pageContent.includes('<script>alert') && 
                           !pageContent.includes('&lt;script&gt;');
        
        if (isVulnerable) {
            console.log('❌ VULNERABILIDAD CONFIRMADA: Stored XSS presente');
            console.log('🔍 El payload XSS no está siendo sanitizado correctamente');
            
            // Capturar evidencia
            await page.screenshot({ 
                path: `evidence-stored-xss-${Date.now()}.png`,
                fullPage: true 
            });
            
            return {
                status: 'VULNERABLE',
                vulnerabilityType: 'Stored XSS',
                severity: 'CRITICAL',
                evidence: 'Script tag displayed without escaping',
                recommendation: 'Implement proper input sanitization and output encoding'
            };
        } else {
            console.log('✅ VULNERABILIDAD CORREGIDA: Stored XSS no presente');
            return {
                status: 'FIXED',
                vulnerabilityType: 'Stored XSS',
                severity: 'CRITICAL',
                evidence: 'Script tag properly escaped or sanitized'
            };
        }
        
    } catch (error) {
        console.error('❌ Error durante la validación:', error);
        return {
            status: 'ERROR',
            error: error.message
        };
    } finally {
        await browser.close();
        console.log('🔒 VALIDACIÓN COMPLETADA');
    }
}

// Ejecutar validación
if (require.main === module) {
    validateStoredXSSVulnerability()
        .then(result => {
            console.log('\n📊 RESULTADO DE VALIDACIÓN:');
            console.log(JSON.stringify(result, null, 2));
        })
        .catch(console.error);
}

module.exports = { validateStoredXSSVulnerability };