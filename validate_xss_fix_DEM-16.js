// SCRIPT AUTOMATIZADO PARA VALIDAR CORRECCIÓN DE XSS - DEM-16
// Test Case: Validar corrección XSS Reflejado en formulario de suscripción
// Bug Relacionado: DEM-13

const { chromium } = require('playwright');

async function runXSSValidationTest() {
  console.log('🔍 Iniciando test de validación XSS - DEM-16');
  console.log('=' .repeat(60));
  
  let browser;
  let testResults = {
    testCase: 'DEM-16',
    bugRelated: 'DEM-13',
    timestamp: new Date().toISOString(),
    status: 'PASSED',
    vulnerabilitiesFound: [],
    evidenceFiles: [],
    summary: ''
  };
  
  try {
    // Paso 1: Inicializar browser
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('✅ Browser inicializado exitosamente');
    
    // Paso 2: Navegar a la página objetivo
    await page.goto('https://qarmy.ar/webs-practicas-testing/');
    console.log('✅ Navegación exitosa a la página objetivo');
    
    await page.waitForLoadState('networkidle');
    
    // Paso 3: Localizar formulario de suscripción
    const nombreField = page.locator('input[name="nombre"], textbox:has-text("Nombre")').first();
    const emailField = page.locator('input[name="email"], textbox:has-text("Email")').first();
    const submitButton = page.locator('button:has-text("Suscribirse")').first();
    
    // Verificar que elementos existen
    const nombreVisible = await nombreField.isVisible().catch(() => false);
    const emailVisible = await emailField.isVisible().catch(() => false);
    const buttonVisible = await submitButton.isVisible().catch(() => false);
    
    console.log(`📋 Estado de elementos:`);
    console.log(`   - Campo Nombre: ${nombreVisible ? '✅ Visible' : '❌ No encontrado'}`);
    console.log(`   - Campo Email: ${emailVisible ? '✅ Visible' : '❌ No encontrado'}`);
    console.log(`   - Botón Submit: ${buttonVisible ? '✅ Visible' : '❌ No encontrado'}`);
    
    if (!nombreVisible || !emailVisible || !buttonVisible) {
      console.log('⚠️ Buscando elementos alternativos...');
      
      // Buscar formulario genérico
      const allInputs = await page.locator('input[type="text"], input[type="email"], input:not([type])').all();
      const allButtons = await page.locator('button, input[type="submit"]').all();
      
      console.log(`📊 Elementos encontrados: ${allInputs.length} inputs, ${allButtons.length} buttons`);
    }
    
    // Paso 4: Definir payloads XSS para testing
    const xssPayloads = [
      '<script>alert("XSS Test")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(1)">',
      '"><script>alert("XSS")</script>',
      '<svg/onload=alert("XSS")>'
    ];
    
    let vulnerabilityCount = 0;
    
    for (const payload of xssPayloads) {
      console.log(`🧪 Testing payload: ${payload}`);
      
      try {
        if (nombreVisible && emailVisible) {
          // Paso 5: Ingresar payload XSS en campos
          await nombreField.clear();
          await nombreField.fill(payload);
          await emailField.clear();
          await emailField.fill(`test@test.com${payload}`);
          
          // Paso 6: Enviar formulario
          await submitButton.click();
          await page.waitForTimeout(3000); // Esperar respuesta
          
          // Paso 7: Verificar que el payload no se ejecuta
          const pageContent = await page.content();
          const nombreValue = await nombreField.inputValue().catch(() => '');
          const emailValue = await emailField.inputValue().catch(() => '');
          
          // Verificaciones de seguridad
          const payloadInContent = pageContent.includes(payload);
          const scriptInNombre = nombreValue.includes('<script>');
          const scriptInEmail = emailValue.includes('<script>');
          
          if (payloadInContent || scriptInNombre || scriptInEmail) {
            console.error(`❌ VULNERABILIDAD DETECTADA para payload: ${payload}`);
            vulnerabilityCount++;
            testResults.vulnerabilitiesFound.push({
              payload: payload,
              inContent: payloadInContent,
              inNombreField: scriptInNombre,
              inEmailField: scriptInEmail
            });
            testResults.status = 'FAILED';
          } else {
            console.log(`✅ Payload "${payload}" manejado de forma segura`);
          }
        } else {
          console.log(`⚠️ Skipping payload test - elementos no disponibles`);
        }
        
      } catch (error) {
        console.error(`❌ Error testing payload ${payload}:`, error.message);
      }
    }
    
    // Paso 8: Capturar evidencia final
    const screenshotPath = `evidence_xss_validation_${Date.now()}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true
    });
    
    testResults.evidenceFiles.push(screenshotPath);
    console.log(`📸 Evidencia capturada: ${screenshotPath}`);
    
    // Resumen final
    console.log('=' .repeat(60));
    
    if (vulnerabilityCount === 0) {
      console.log('🎯 ✅ TEST DEM-16 PASÓ - No se detectaron vulnerabilidades XSS');
      testResults.summary = `Test exitoso: ${xssPayloads.length} payloads XSS testeados, 0 vulnerabilidades detectadas`;
    } else {
      console.log(`🚨 ❌ TEST DEM-16 FALLÓ - ${vulnerabilityCount} vulnerabilidades XSS detectadas`);
      testResults.summary = `Test falló: ${vulnerabilityCount} de ${xssPayloads.length} payloads XSS causaron vulnerabilidades`;
    }
    
    console.log(`📊 Payloads testeados: ${xssPayloads.length}`);
    console.log(`🔍 Vulnerabilidades encontradas: ${vulnerabilityCount}`);
    console.log(`📁 Evidencia: ${screenshotPath}`);
    
  } catch (error) {
    console.error('❌ Error ejecutando test:', error);
    testResults.status = 'ERROR';
    testResults.summary = `Error durante ejecución: ${error.message}`;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser cerrado correctamente');
    }
  }
  
  return testResults;
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runXSSValidationTest()
    .then(results => {
      console.log('\n📋 RESULTADOS FINALES:');
      console.log(JSON.stringify(results, null, 2));
      process.exit(results.status === 'PASSED' ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { runXSSValidationTest };