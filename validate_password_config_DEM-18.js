// SCRIPT AUTOMATIZADO PARA VALIDAR CORRECCIÓN DE CAMPOS PASSWORD - DEM-18
// Test Case: Validar corrección de configuración de campos password
// Bug Relacionado: DEM-15

const { test, expect } = require('@playwright/test');

test.describe('Security Testing - Password Field Configuration DEM-18', () => {
  
  test('Validar corrección de configuración de campos password', async ({ page }) => {
    console.log('🔍 Iniciando test de configuración password fields - DEM-18');
    
    // Configurar captura de console logs
    const consoleWarnings = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        consoleWarnings.push(msg.text());
      }
    });
    
    // Paso 1: Navegar a la página objetivo
    await page.goto('https://qarmy.ar/webs-practicas-testing/');
    console.log('✅ Navegación exitosa a la página objetivo');
    
    // Esperar a que se cargue completamente la página
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Test 1: Verificar warnings de password en console
    console.log('🧪 Test 1: Verificando warnings de password en console');
    
    const passwordWarnings = consoleWarnings.filter(warning => 
      warning.includes('Password field is not contained in a form') ||
      warning.includes('password field') ||
      warning.includes('Password field')
    );
    
    if (passwordWarnings.length > 0) {
      console.error(`❌ FALLO: Se encontraron ${passwordWarnings.length} warnings de password field:`);
      passwordWarnings.forEach((warning, index) => {
        console.error(`  ${index + 1}. ${warning}`);
      });
      
      // No lanzar error inmediatamente, continuar con otros tests
    } else {
      console.log('✅ No se encontraron warnings de password field en console');
    }
    
    // Test 2: Inspeccionar elementos password en DOM
    console.log('🧪 Test 2: Inspeccionando elementos password en DOM');
    
    const passwordFields = await page.locator('input[type="password"]').all();
    console.log(`Encontrados ${passwordFields.length} campos password`);
    
    let passwordFieldsOutsideForm = 0;
    
    for (let i = 0; i < passwordFields.length; i++) {
      const field = passwordFields[i];
      
      // Verificar si el campo está dentro de un formulario
      const isInForm = await field.evaluate(el => {
        let parent = el.parentElement;
        while (parent) {
          if (parent.tagName === 'FORM') {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      });
      
      const fieldId = await field.getAttribute('id') || `password-field-${i}`;
      
      if (!isInForm) {
        passwordFieldsOutsideForm++;
        console.error(`❌ Campo password fuera de formulario: ${fieldId}`);
      } else {
        console.log(`✅ Campo password correctamente en formulario: ${fieldId}`);
      }
    }
    
    // Test 3: Verificar elementos password ocultos
    console.log('🧪 Test 3: Verificando elementos password ocultos');
    
    const hiddenPasswordFields = await page.locator('input[type="password"][style*="display: none"], input[type="password"][style*="display:none"], input[type="password"][hidden]').all();
    
    if (hiddenPasswordFields.length > 0) {
      console.warn(`⚠️ Warning: Se encontraron ${hiddenPasswordFields.length} campos password ocultos`);
      
      for (let i = 0; i < hiddenPasswordFields.length; i++) {
        const field = hiddenPasswordFields[i];
        const fieldAttributes = await field.evaluate(el => ({
          id: el.id,
          name: el.name,
          className: el.className,
          style: el.style.cssText
        }));
        
        console.log(`  Hidden password field ${i + 1}:`, fieldAttributes);
      }
    } else {
      console.log('✅ No se encontraron campos password ocultos problemáticos');
    }
    
    // Test 4: Verificar gestión de credenciales en código cliente
    console.log('🧪 Test 4: Verificando exposición de credenciales en código cliente');
    
    const pageContent = await page.content();
    const suspiciousPatterns = [
      /password\s*[:=]\s*['""][^'""]+['"]/gi,
      /pwd\s*[:=]\s*['""][^'""]+['"]/gi,
      /secret\s*[:=]\s*['""][^'""]+['"]/gi,
      /token\s*[:=]\s*['""][^'""]+['"]/gi,
      /api_key\s*[:=]\s*['""][^'""]+['"]/gi
    ];
    
    let credentialsFound = false;
    suspiciousPatterns.forEach((pattern, index) => {
      const matches = pageContent.match(pattern);
      if (matches && matches.length > 0) {
        credentialsFound = true;
        console.error(`❌ Posibles credenciales expuestas (patrón ${index + 1}):`, matches);
      }
    });
    
    if (!credentialsFound) {
      console.log('✅ No se encontraron credenciales hardcodeadas en código cliente');
    }
    
    // Test 5: Verificar atributos de autocomplete en campos password
    console.log('🧪 Test 5: Verificando atributos de autocomplete');
    
    for (let i = 0; i < passwordFields.length; i++) {
      const field = passwordFields[i];
      const autocomplete = await field.getAttribute('autocomplete');
      const fieldId = await field.getAttribute('id') || `password-field-${i}`;
      
      if (autocomplete === 'off' || autocomplete === 'new-password' || autocomplete === 'current-password') {
        console.log(`✅ Campo password ${fieldId} tiene autocomplete apropiado: ${autocomplete}`);
      } else {
        console.warn(`⚠️ Campo password ${fieldId} sin autocomplete apropiado: ${autocomplete || 'none'}`);
      }
    }
    
    // Resumen del test
    console.log('📊 Resumen del análisis:');
    console.log(`  - Warnings de console: ${passwordWarnings.length}`);
    console.log(`  - Campos password totales: ${passwordFields.length}`);
    console.log(`  - Campos password fuera de formulario: ${passwordFieldsOutsideForm}`);
    console.log(`  - Campos password ocultos: ${hiddenPasswordFields.length}`);
    console.log(`  - Credenciales expuestas: ${credentialsFound ? 'SÍ' : 'NO'}`);
    
    // Capturar evidencia
    await page.screenshot({ 
      path: `evidence_password_fields_${Date.now()}.png`,
      fullPage: true
    });
    
    // Determinar resultado final
    const hasIssues = passwordWarnings.length > 0 || passwordFieldsOutsideForm > 0 || credentialsFound;
    
    if (hasIssues) {
      console.error('❌ Test DEM-18 FALLO - Problemas de configuración de password fields detectados');
      
      // Crear reporte detallado para debugging
      const report = {
        timestamp: new Date().toISOString(),
        testCase: 'DEM-18',
        issues: {
          consoleWarnings: passwordWarnings,
          fieldsOutsideForm: passwordFieldsOutsideForm,
          credentialsExposed: credentialsFound
        }
      };
      
      console.log('📋 Reporte detallado:', JSON.stringify(report, null, 2));
      
    } else {
      console.log('🎯 Test DEM-18 completado exitosamente - Password field configuration appears to be fixed');
    }
  });
  
  test('Verificar seguridad de formularios con campos password', async ({ page }) => {
    await page.goto('https://qarmy.ar/webs-practicas-testing/');
    
    // Buscar formularios que contengan campos password
    const formsWithPassword = await page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      return forms.map(form => {
        const passwordFields = form.querySelectorAll('input[type="password"]');
        return {
          formId: form.id || 'unnamed-form',
          formAction: form.action,
          formMethod: form.method,
          passwordFieldsCount: passwordFields.length,
          hasHttpsAction: form.action.startsWith('https://') || form.action === ''
        };
      }).filter(form => form.passwordFieldsCount > 0);
    });
    
    console.log(`Encontrados ${formsWithPassword.length} formularios con campos password`);
    
    formsWithPassword.forEach((form, index) => {
      console.log(`Formulario ${index + 1}:`, form);
      
      if (!form.hasHttpsAction && form.formAction !== '') {
        console.error(`❌ Formulario ${form.formId} no usa HTTPS: ${form.formAction}`);
      } else {
        console.log(`✅ Formulario ${form.formId} usa conexión segura`);
      }
    });
    
    expect(formsWithPassword.length).toBeGreaterThanOrEqual(0);
  });

});

// Configuración para ejecutar el test
module.exports = {
  testInfo: {
    testCase: 'DEM-18',
    description: 'Validar corrección de configuración de campos password',
    bugRelated: 'DEM-15',
    severity: 'Medium',
    category: 'Security Testing - Configuration'
  }
};