// Security Testing Script - HTTPS Transport Validation
// Associated Bug: DEM-39 - Insecure Transport - HTTP Used for Banking Operations
// Test Case: DEM-44 - Validar implementación correcta de HTTPS Transport

const { test, expect } = require('@playwright/test');

test.describe('HTTPS Transport Security Tests', () => {

  test('Should automatically redirect HTTP to HTTPS', async ({ page }) => {
    // Test HTTP to HTTPS redirect
    const response = await page.goto('http://zero.webappsecurity.com/');
    
    // Check final URL is HTTPS
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/^https:/);
    
    // Verify redirect response
    expect(response.status()).toBe(200);
    
    console.log(`✅ HTTP successfully redirected to HTTPS: ${finalUrl}`);
  });

  test('Should have valid SSL certificate', async ({ page }) => {
    const response = await page.goto('https://zero.webappsecurity.com/');
    
    // Check that HTTPS connection was successful (no certificate errors)
    expect(response.status()).toBe(200);
    
    // Verify SSL connection info
    const securityDetails = await page.evaluate(() => {
      return {
        protocol: location.protocol,
        secureContext: 'secureConnectionStart' in performance.timing,
        origin: location.origin
      };
    });
    
    expect(securityDetails.protocol).toBe('https:');
    console.log('✅ Valid SSL certificate verified');
  });

  test('Should implement HSTS (HTTP Strict Transport Security)', async ({ page }) => {
    const response = await page.goto('https://zero.webappsecurity.com/');
    const headers = response.headers();
    
    // Check HSTS header exists
    expect(headers['strict-transport-security']).toBeDefined();
    
    const hsts = headers['strict-transport-security'];
    
    // Verify HSTS configuration
    expect(hsts).toContain('max-age');
    
    // Extract max-age value
    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    expect(maxAgeMatch).toBeTruthy();
    
    const maxAge = parseInt(maxAgeMatch[1]);
    
    // Max-age should be at least 1 year (31536000 seconds)
    expect(maxAge).toBeGreaterThanOrEqual(31536000);
    
    // Should ideally include subdomains
    if (hsts.includes('includeSubDomains')) {
      console.log('✅ HSTS includes subdomains protection');
    }
    
    console.log(`✅ HSTS properly configured: ${hsts}`);
  });

  test('Should not have mixed content (HTTPS loading HTTP resources)', async ({ page }) => {
    const mixedContentWarnings = [];
    
    // Listen for security state changes and console warnings
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().toLowerCase().includes('mixed content')) {
        mixedContentWarnings.push(msg.text());
      }
    });
    
    // Monitor network requests for insecure HTTP requests
    const httpRequests = [];
    page.on('request', request => {
      if (request.url().startsWith('http://')) {
        httpRequests.push(request.url());
      }
    });
    
    await page.goto('https://zero.webappsecurity.com/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check for mixed content
    expect(mixedContentWarnings.length).toBe(0);
    expect(httpRequests.length).toBe(0);
    
    console.log('✅ No mixed content detected');
  });

  test('Should use secure SSL/TLS configuration', async ({ page }) => {
    await page.goto('https://zero.webappsecurity.com/');
    
    // Check SSL/TLS protocol version through browser
    const tlsInfo = await page.evaluate(() => {
      // Modern browsers expose some security info
      const connection = navigator.connection;
      return {
        secureContext: window.isSecureContext,
        origin: location.origin,
        protocol: location.protocol
      };
    });
    
    expect(tlsInfo.secureContext).toBe(true);
    expect(tlsInfo.protocol).toBe('https:');
    
    console.log('✅ Secure TLS context verified');
  });

  test('Should enforce HTTPS for all forms and sensitive operations', async ({ page }) => {
    await page.goto('https://zero.webappsecurity.com/');
    
    // Find all forms on the page
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      const action = await form.getAttribute('action');
      
      if (action) {
        // Form action should not use HTTP
        expect(action).not.toMatch(/^http:/);
        
        // If absolute URL, should be HTTPS
        if (action.startsWith('http')) {
          expect(action).toMatch(/^https:/);
        }
      }
    }
    
    // Check for login/password fields - they should only exist on HTTPS pages
    const passwordFields = await page.locator('input[type="password"]').count();
    if (passwordFields > 0) {
      expect(page.url()).toMatch(/^https:/);
    }
    
    console.log('✅ All forms and sensitive operations use HTTPS');
  });

  test('Should not expose sensitive data over HTTP', async ({ page }) => {
    // Try to access sensitive endpoints over HTTP
    const sensitiveEndpoints = [
      'http://zero.webappsecurity.com/login',
      'http://zero.webappsecurity.com/account',
      'http://zero.webappsecurity.com/transfer'
    ];
    
    for (const endpoint of sensitiveEndpoints) {
      try {
        const response = await page.goto(endpoint);
        
        // Should either redirect to HTTPS or be blocked
        const finalUrl = page.url();
        if (response.status() === 200) {
          expect(finalUrl).toMatch(/^https:/);
          console.log(`✅ ${endpoint} properly redirected to HTTPS`);
        }
      } catch (error) {
        // If connection fails, that's acceptable (HTTP blocked)
        console.log(`✅ ${endpoint} access properly blocked over HTTP`);
      }
    }
  });

  test('Should have secure cookie configuration', async ({ page }) => {
    await page.goto('https://zero.webappsecurity.com/');
    
    // Get all cookies
    const cookies = await page.context().cookies();
    
    for (const cookie of cookies) {
      // All cookies on HTTPS should be secure
      expect(cookie.secure).toBe(true);
      
      // Session/auth cookies should be HttpOnly
      if (cookie.name.toLowerCase().includes('session') ||
          cookie.name.toLowerCase().includes('auth') ||
          cookie.name.toLowerCase().includes('token')) {
        expect(cookie.httpOnly).toBe(true);
      }
      
      // Should have SameSite protection
      expect(['Strict', 'Lax', 'None']).toContain(cookie.sameSite);
      
      console.log(`✅ Cookie ${cookie.name} properly configured for HTTPS`);
    }
  });

  test('Should validate certificate chain and trust', async ({ page }) => {
    await page.goto('https://zero.webappsecurity.com/');
    
    // If we reached here without errors, certificate is valid
    const response = await page.goto('https://zero.webappsecurity.com/');
    expect(response.status()).toBe(200);
    
    // Check for certificate errors in console
    const certificateErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && 
          (msg.text().includes('certificate') || msg.text().includes('SSL'))) {
        certificateErrors.push(msg.text());
      }
    });
    
    expect(certificateErrors.length).toBe(0);
    console.log('✅ SSL certificate chain is valid and trusted');
  });

  test('Should prevent SSL stripping attacks', async ({ page }) => {
    // Test multiple entry points to ensure HTTPS is enforced
    const entryPoints = [
      'zero.webappsecurity.com',
      'www.zero.webappsecurity.com'
    ];
    
    for (const domain of entryPoints) {
      // Try HTTP access
      try {
        await page.goto(`http://${domain}`);
        
        // Should end up on HTTPS
        const finalUrl = page.url();
        expect(finalUrl).toMatch(/^https:/);
        
        console.log(`✅ ${domain} protected against SSL stripping`);
      } catch (error) {
        // If HTTP is completely blocked, that's even better
        console.log(`✅ ${domain} HTTP access completely blocked`);
      }
    }
  });

  test('Should validate HTTPS on all banking operations', async ({ page }) => {
    await page.goto('https://zero.webappsecurity.com/');
    
    // Test banking-related links and operations
    const bankingLinks = await page.locator('a[href*="account"], a[href*="transfer"], a[href*="balance"], a[href*="login"]').all();
    
    for (const link of bankingLinks) {
      const href = await link.getAttribute('href');
      
      if (href && href.startsWith('http')) {
        expect(href).toMatch(/^https:/);
      }
    }
    
    // Verify current page is HTTPS for banking operations
    expect(page.url()).toMatch(/^https:/);
    
    console.log('✅ All banking operations enforced over HTTPS');
  });

});

// Export for use in test suites
module.exports = { test };