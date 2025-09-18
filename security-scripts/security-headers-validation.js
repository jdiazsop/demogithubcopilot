// Security Testing Script - Security Headers Validation
// Associated Bug: DEM-37 - Missing Security Headers - No HTTP Security Headers Implemented
// Test Case: DEM-42 - Validar implementación de Security Headers

const { test, expect } = require('@playwright/test');

test.describe('Security Headers Validation Tests', () => {

  test('Should have X-Frame-Options header', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Check X-Frame-Options header exists
    expect(headers['x-frame-options']).toBeDefined();
    
    // Verify it has secure values
    const frameOptions = headers['x-frame-options'];
    const validValues = ['DENY', 'SAMEORIGIN'];
    expect(validValues).toContain(frameOptions.toUpperCase());
    
    console.log(`✅ X-Frame-Options header correctly set: ${frameOptions}`);
  });

  test('Should have X-XSS-Protection header', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Check X-XSS-Protection header exists
    expect(headers['x-xss-protection']).toBeDefined();
    
    // Verify it's properly configured
    const xssProtection = headers['x-xss-protection'];
    expect(xssProtection).toMatch(/1/); // Should be enabled
    
    // Preferably should have mode=block
    if (xssProtection.includes('mode')) {
      expect(xssProtection).toContain('mode=block');
    }
    
    console.log(`✅ X-XSS-Protection header correctly set: ${xssProtection}`);
  });

  test('Should have X-Content-Type-Options header', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Check X-Content-Type-Options header exists
    expect(headers['x-content-type-options']).toBeDefined();
    
    // Verify it's set to nosniff
    const contentTypeOptions = headers['x-content-type-options'];
    expect(contentTypeOptions.toLowerCase()).toBe('nosniff');
    
    console.log(`✅ X-Content-Type-Options header correctly set: ${contentTypeOptions}`);
  });

  test('Should have Content-Security-Policy header', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Check CSP header exists (either CSP or CSP-Report-Only)
    const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
    expect(csp).toBeDefined();
    
    // Verify CSP has basic security directives
    expect(csp).toContain('default-src');
    
    // Should not allow unsafe practices
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("'unsafe-inline'");
    
    console.log(`✅ Content-Security-Policy header correctly configured`);
  });

  test('Should have Strict-Transport-Security header for HTTPS', async ({ page }) => {
    // Test with HTTPS version if available
    let response;
    try {
      response = await page.goto('https://the-internet.herokuapp.com/');
    } catch (error) {
      console.log('HTTPS not available, skipping HSTS test');
      return;
    }
    
    const headers = response.headers();
    
    // Check HSTS header exists for HTTPS connections
    expect(headers['strict-transport-security']).toBeDefined();
    
    const hsts = headers['strict-transport-security'];
    
    // Verify it has max-age directive
    expect(hsts).toContain('max-age');
    
    // Extract max-age value and verify it's reasonable (at least 1 day)
    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    if (maxAgeMatch) {
      const maxAge = parseInt(maxAgeMatch[1]);
      expect(maxAge).toBeGreaterThanOrEqual(86400); // At least 1 day
    }
    
    console.log(`✅ Strict-Transport-Security header correctly set: ${hsts}`);
  });

  test('Should have Referrer-Policy header', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Check Referrer-Policy header exists
    expect(headers['referrer-policy']).toBeDefined();
    
    const referrerPolicy = headers['referrer-policy'];
    
    // Verify it's set to a secure value
    const secureValues = [
      'no-referrer',
      'no-referrer-when-downgrade', 
      'strict-origin',
      'strict-origin-when-cross-origin'
    ];
    
    expect(secureValues).toContain(referrerPolicy);
    
    console.log(`✅ Referrer-Policy header correctly set: ${referrerPolicy}`);
  });

  test('Should not expose sensitive server information', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/');
    const headers = response.headers();
    
    // Server header should not reveal detailed version info
    if (headers['server']) {
      const server = headers['server'];
      
      // Should not contain detailed version numbers
      expect(server).not.toMatch(/\d+\.\d+\.\d+/);
      
      // Should not contain common vulnerable patterns
      expect(server.toLowerCase()).not.toContain('apache/2.2');
      expect(server.toLowerCase()).not.toContain('nginx/1.0');
      
      console.log(`✅ Server header appropriately configured: ${server}`);
    }
    
    // X-Powered-By should not be present (information disclosure)
    expect(headers['x-powered-by']).toBeUndefined();
    console.log('✅ X-Powered-By header correctly removed');
  });

  test('Should validate security headers across multiple pages', async ({ page }) => {
    const testPages = [
      'https://the-internet.herokuapp.com/',
      'https://the-internet.herokuapp.com/login',
      'https://the-internet.herokuapp.com/upload'
    ];
    
    for (const url of testPages) {
      const response = await page.goto(url);
      const headers = response.headers();
      
      // Essential security headers should be present on all pages
      const essentialHeaders = ['x-frame-options', 'x-content-type-options'];
      
      for (const header of essentialHeaders) {
        expect(headers[header]).toBeDefined();
      }
      
      console.log(`✅ Security headers verified for: ${url}`);
    }
  });

  test('Should test CSP effectiveness against XSS', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    
    // Try to inject inline script - should be blocked by CSP
    const scriptInjected = await page.evaluate(() => {
      try {
        const script = document.createElement('script');
        script.innerHTML = 'window.xssTest = true;';
        document.head.appendChild(script);
        return window.xssTest === true;
      } catch (error) {
        return false;
      }
    });
    
    // CSP should prevent inline script execution
    expect(scriptInjected).toBe(false);
    console.log('✅ CSP effectively blocks inline script injection');
  });

});

// Export for use in test suites
module.exports = { test };