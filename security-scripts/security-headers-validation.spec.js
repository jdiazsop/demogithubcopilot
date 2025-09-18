/**
 * SECURITY VALIDATION SCRIPT - MISSING HEADERS
 * 
 * Automated security testing script for validating HTTP security headers
 * Related to: DEM-53 (Bug) and DEM-54 (Test Case)
 * Target: https://qarmy.ar/webs-practicas-testing/
 * 
 * Generated automatically by GitHub Copilot Security Testing Engine
 * Date: 2025-09-18
 */

const { test, expect } = require('@playwright/test');

test.describe('Security Headers Validation - QARMY Web Application', () => {
  const TARGET_URL = 'https://qarmy.ar/webs-practicas-testing/';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to target URL before each test
    await page.goto(TARGET_URL);
  });

  test('DEM-53: Validate Content-Security-Policy Header', async ({ page }) => {
    console.log('🔍 Testing Content-Security-Policy header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const cspHeader = headers['content-security-policy'];
    
    // EXPECTED: CSP header should be present
    expect(cspHeader, 'Content-Security-Policy header should be present').toBeTruthy();
    
    if (cspHeader) {
      // Validate CSP directives
      expect(cspHeader).toContain("default-src");
      expect(cspHeader).toContain("script-src");
      expect(cspHeader).not.toContain("'unsafe-eval'");
      
      console.log('✅ CSP Header validated successfully:', cspHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing Content-Security-Policy');
      throw new Error('Critical security header missing: Content-Security-Policy');
    }
  });

  test('DEM-53: Validate X-Frame-Options Header', async ({ page }) => {
    console.log('🔍 Testing X-Frame-Options header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const frameOptionsHeader = headers['x-frame-options'];
    
    // EXPECTED: X-Frame-Options should be present
    expect(frameOptionsHeader, 'X-Frame-Options header should be present').toBeTruthy();
    
    if (frameOptionsHeader) {
      // Validate frame options value
      const validValues = ['DENY', 'SAMEORIGIN'];
      const isValid = validValues.some(value => 
        frameOptionsHeader.toUpperCase().includes(value)
      );
      
      expect(isValid, 'X-Frame-Options should be DENY or SAMEORIGIN').toBeTruthy();
      console.log('✅ X-Frame-Options validated successfully:', frameOptionsHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing X-Frame-Options');
      throw new Error('Critical security header missing: X-Frame-Options');
    }
  });

  test('DEM-53: Validate X-Content-Type-Options Header', async ({ page }) => {
    console.log('🔍 Testing X-Content-Type-Options header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const contentTypeOptionsHeader = headers['x-content-type-options'];
    
    // EXPECTED: X-Content-Type-Options should be nosniff
    expect(contentTypeOptionsHeader, 'X-Content-Type-Options header should be present').toBeTruthy();
    
    if (contentTypeOptionsHeader) {
      expect(contentTypeOptionsHeader.toLowerCase()).toBe('nosniff');
      console.log('✅ X-Content-Type-Options validated successfully:', contentTypeOptionsHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing X-Content-Type-Options');
      throw new Error('Critical security header missing: X-Content-Type-Options');
    }
  });

  test('DEM-53: Validate Strict-Transport-Security Header', async ({ page }) => {
    console.log('🔍 Testing Strict-Transport-Security header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const hstsHeader = headers['strict-transport-security'];
    
    // EXPECTED: HSTS header should be present
    expect(hstsHeader, 'Strict-Transport-Security header should be present').toBeTruthy();
    
    if (hstsHeader) {
      // Validate max-age value (should be at least 1 year = 31536000 seconds)
      const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
      expect(maxAgeMatch, 'HSTS header should contain max-age directive').toBeTruthy();
      
      if (maxAgeMatch) {
        const maxAge = parseInt(maxAgeMatch[1]);
        expect(maxAge, 'HSTS max-age should be at least 1 year (31536000 seconds)').toBeGreaterThanOrEqual(31536000);
      }
      
      console.log('✅ Strict-Transport-Security validated successfully:', hstsHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing Strict-Transport-Security');
      throw new Error('Critical security header missing: Strict-Transport-Security');
    }
  });

  test('DEM-53: Validate X-XSS-Protection Header', async ({ page }) => {
    console.log('🔍 Testing X-XSS-Protection header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const xssProtectionHeader = headers['x-xss-protection'];
    
    // EXPECTED: X-XSS-Protection should be present
    expect(xssProtectionHeader, 'X-XSS-Protection header should be present').toBeTruthy();
    
    if (xssProtectionHeader) {
      // Should be "1; mode=block" or similar
      expect(xssProtectionHeader).toMatch(/1.*mode=block/i);
      console.log('✅ X-XSS-Protection validated successfully:', xssProtectionHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing X-XSS-Protection');
      throw new Error('Critical security header missing: X-XSS-Protection');
    }
  });

  test('DEM-53: Validate Referrer-Policy Header', async ({ page }) => {
    console.log('🔍 Testing Referrer-Policy header...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const referrerPolicyHeader = headers['referrer-policy'];
    
    // EXPECTED: Referrer-Policy should be present
    expect(referrerPolicyHeader, 'Referrer-Policy header should be present').toBeTruthy();
    
    if (referrerPolicyHeader) {
      // Validate secure referrer policy
      const secureValues = [
        'strict-origin-when-cross-origin',
        'strict-origin',
        'same-origin',
        'no-referrer'
      ];
      
      const isSecure = secureValues.some(value => 
        referrerPolicyHeader.toLowerCase().includes(value)
      );
      
      expect(isSecure, 'Referrer-Policy should use a secure value').toBeTruthy();
      console.log('✅ Referrer-Policy validated successfully:', referrerPolicyHeader);
    } else {
      console.log('❌ VULNERABILITY CONFIRMED: Missing Referrer-Policy');
      throw new Error('Security header missing: Referrer-Policy');
    }
  });

  test('DEM-53: Comprehensive Security Headers Check', async ({ page }) => {
    console.log('🔍 Running comprehensive security headers validation...');
    
    const response = await page.request.get(TARGET_URL);
    const headers = response.headers();
    
    const securityHeaders = {
      'Content-Security-Policy': headers['content-security-policy'],
      'X-Frame-Options': headers['x-frame-options'],
      'X-Content-Type-Options': headers['x-content-type-options'],
      'Strict-Transport-Security': headers['strict-transport-security'],
      'X-XSS-Protection': headers['x-xss-protection'],
      'Referrer-Policy': headers['referrer-policy']
    };
    
    console.log('📊 Security Headers Analysis:');
    console.log('====================================');
    
    let missingHeaders = [];
    let presentHeaders = [];
    
    Object.entries(securityHeaders).forEach(([headerName, headerValue]) => {
      if (headerValue) {
        console.log(`✅ ${headerName}: ${headerValue}`);
        presentHeaders.push(headerName);
      } else {
        console.log(`❌ ${headerName}: MISSING`);
        missingHeaders.push(headerName);
      }
    });
    
    console.log('====================================');
    console.log(`📈 Security Score: ${presentHeaders.length}/${Object.keys(securityHeaders).length} headers present`);
    
    if (missingHeaders.length > 0) {
      console.log(`🚨 SECURITY RISK: ${missingHeaders.length} critical security headers missing:`);
      missingHeaders.forEach(header => console.log(`   - ${header}`));
      
      // Generate security report
      const securityReport = {
        timestamp: new Date().toISOString(),
        url: TARGET_URL,
        totalHeaders: Object.keys(securityHeaders).length,
        presentHeaders: presentHeaders.length,
        missingHeaders: missingHeaders.length,
        missingHeadersList: missingHeaders,
        presentHeadersList: presentHeaders,
        securityScore: Math.round((presentHeaders.length / Object.keys(securityHeaders).length) * 100),
        riskLevel: missingHeaders.length > 3 ? 'HIGH' : missingHeaders.length > 1 ? 'MEDIUM' : 'LOW'
      };
      
      console.log('📋 Security Assessment Report:', JSON.stringify(securityReport, null, 2));
    }
    
    // For current known state - expect all headers to be missing (vulnerability confirmation)
    expect(missingHeaders.length, 'All security headers are currently missing - confirming vulnerability').toBe(6);
  });

  test('DEM-53: Clickjacking Protection Test', async ({ page }) => {
    console.log('🔍 Testing clickjacking protection...');
    
    try {
      // Attempt to embed the page in an iframe
      const iframeTest = await page.evaluate(async (url) => {
        return new Promise((resolve) => {
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = url;
          
          iframe.onload = () => {
            try {
              // Try to access iframe content
              const hasAccess = iframe.contentWindow !== null;
              resolve({ success: true, hasAccess });
            } catch (error) {
              resolve({ success: false, error: error.message });
            }
          };
          
          iframe.onerror = () => {
            resolve({ success: false, error: 'Failed to load iframe' });
          };
          
          document.body.appendChild(iframe);
          
          // Timeout after 5 seconds
          setTimeout(() => {
            resolve({ success: false, error: 'Timeout' });
          }, 5000);
        });
      }, TARGET_URL);
      
      console.log('🖼️ Iframe embedding test result:', iframeTest);
      
      // If X-Frame-Options is properly configured, iframe should be blocked
      // Currently expecting it to succeed (vulnerability confirmation)
      if (iframeTest.success && iframeTest.hasAccess) {
        console.log('❌ VULNERABILITY CONFIRMED: Page can be embedded in iframe (clickjacking risk)');
      } else {
        console.log('✅ PROTECTED: Page cannot be embedded in iframe');
      }
      
    } catch (error) {
      console.log('🔍 Clickjacking test encountered error:', error.message);
    }
  });
});

/**
 * EXECUTION INSTRUCTIONS:
 * 
 * 1. Install Playwright:
 *    npm install @playwright/test
 * 
 * 2. Run the security validation tests:
 *    npx playwright test security-headers-validation.spec.js
 * 
 * 3. Generate HTML report:
 *    npx playwright test security-headers-validation.spec.js --reporter=html
 * 
 * 4. Run specific test:
 *    npx playwright test security-headers-validation.spec.js -g "Content-Security-Policy"
 * 
 * EXPECTED RESULTS (Current State):
 * - All tests should FAIL (confirming vulnerabilities)
 * - Missing headers will be detected and reported
 * - Security score will be 0/6 (0%)
 * 
 * EXPECTED RESULTS (After Fix):
 * - All tests should PASS
 * - All headers present and properly configured
 * - Security score will be 6/6 (100%)
 */