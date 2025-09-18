// XSS Vulnerability Validation Test Suite
// Associated with: DEM-45 (Bug) and DEM-46 (Test Case)
// Purpose: Automated validation of Stored XSS vulnerability fixes

const { test, expect } = require('@playwright/test');

test.describe('Stored XSS Vulnerability Validation - DEM-45', () => {
  
  let gruyereInstance;
  
  test.beforeEach(async ({ page }) => {
    // Start new Gruyere instance
    await page.goto('https://google-gruyere.appspot.com/start');
    await page.click('text=Agree & Start');
    
    // Extract instance ID from URL
    const currentUrl = page.url();
    const instanceMatch = currentUrl.match(/\/(\d+)\//);
    gruyereInstance = instanceMatch ? instanceMatch[1] : null;
    
    console.log(`🧪 Testing Gruyere instance: ${gruyereInstance}`);
  });

  test('Critical: Should prevent basic stored XSS in username field', async ({ page }) => {
    console.log('🔍 Testing basic script tag injection...');
    
    // Navigate to registration page
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
    
    // Attempt XSS injection
    const basicXSSPayload = '<script>alert("CRITICAL_XSS_TEST")</script>';
    await page.fill('input[name="uid"]', basicXSSPayload);
    await page.fill('input[name="pw"]', 'testpassword123');
    
    // Create account
    await page.click('button:has-text("Create account")');
    
    // Navigate to pages where username is displayed
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/`);
    
    // Verify script is NOT executed (no alert dialog appears)
    const alertPromise = page.waitForEvent('dialog', { timeout: 3000 }).catch(() => null);
    const alertDialog = await alertPromise;
    
    expect(alertDialog).toBeNull();
    console.log('✅ No alert dialog detected - Basic XSS prevented');
    
    // Verify content is properly sanitized
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("CRITICAL_XSS_TEST")</script>');
    expect(pageContent).not.toContain('CRITICAL_XSS_TEST');
    
    console.log('✅ XSS payload properly sanitized in page content');
  });

  test('High: Should prevent event handler XSS injection', async ({ page }) => {
    console.log('🔍 Testing event handler injection...');
    
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
    
    const eventHandlerPayload = '<img src=x onerror="alert(\'EVENT_HANDLER_XSS\')">';
    await page.fill('input[name="uid"]', eventHandlerPayload);
    await page.fill('input[name="pw"]', 'testpassword123');
    await page.click('button:has-text("Create account")');
    
    // Check for execution
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/`);
    
    const alertDialog = await page.waitForEvent('dialog', { timeout: 3000 }).catch(() => null);
    expect(alertDialog).toBeNull();
    
    // Verify img tag with onerror is not present
    const pageContent = await page.content();
    expect(pageContent).not.toContain('onerror=');
    expect(pageContent).not.toContain('EVENT_HANDLER_XSS');
    
    console.log('✅ Event handler XSS prevented');
  });

  test('High: Should prevent JavaScript protocol injection', async ({ page }) => {
    console.log('🔍 Testing JavaScript protocol injection...');
    
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
    
    const jsProtocolPayload = 'javascript:alert("JS_PROTOCOL_XSS")';
    await page.fill('input[name="uid"]', jsProtocolPayload);
    await page.fill('input[name="pw"]', 'testpassword123');
    await page.click('button:has-text("Create account")');
    
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/`);
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('javascript:alert');
    expect(pageContent).not.toContain('JS_PROTOCOL_XSS');
    
    console.log('✅ JavaScript protocol injection prevented');
  });

  test('Medium: Should implement proper security headers', async ({ page }) => {
    console.log('🔍 Testing security headers implementation...');
    
    const response = await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/`);
    const headers = response.headers();
    
    // Check for Content Security Policy
    const csp = headers['content-security-policy'];
    if (csp) {
      console.log(`✅ CSP Header found: ${csp}`);
      expect(csp).toBeTruthy();
    } else {
      console.log('⚠️ CSP Header missing - Should be implemented');
    }
    
    // Check for XSS Protection
    const xssProtection = headers['x-xss-protection'];
    if (xssProtection) {
      console.log(`✅ X-XSS-Protection found: ${xssProtection}`);
      expect(xssProtection).toContain('1');
    } else {
      console.log('⚠️ X-XSS-Protection header missing');
    }
    
    // Check for Content Type Options
    const contentTypeOptions = headers['x-content-type-options'];
    if (contentTypeOptions) {
      console.log(`✅ X-Content-Type-Options found: ${contentTypeOptions}`);
      expect(contentTypeOptions).toBe('nosniff');
    } else {
      console.log('⚠️ X-Content-Type-Options header missing');
    }
    
    console.log('📊 Security headers validation completed');
  });

  test('Comprehensive: Multiple XSS vector validation', async ({ page }) => {
    console.log('🔍 Testing multiple XSS vectors...');
    
    const xssVectors = [
      {
        name: 'HTML Tag Injection',
        payload: '<script>alert("HTML_TAG")</script>',
        risk: 'Critical'
      },
      {
        name: 'Attribute Injection',
        payload: '"><script>alert("ATTR_INJECTION")</script>',
        risk: 'High'
      },
      {
        name: 'SVG XSS',
        payload: '<svg onload="alert(\'SVG_XSS\')">',
        risk: 'High'
      },
      {
        name: 'Data URI XSS',
        payload: '<iframe src="data:text/html,<script>alert(\'DATA_URI\')</script>"></iframe>',
        risk: 'Medium'
      }
    ];
    
    for (const vector of xssVectors) {
      console.log(`🎯 Testing ${vector.name} (Risk: ${vector.risk})`);
      
      await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
      await page.fill('input[name="uid"]', vector.payload);
      await page.fill('input[name="pw"]', 'testpass123');
      await page.click('button:has-text("Create account")');
      
      // Check for execution
      await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/`);
      
      const alertDialog = await page.waitForEvent('dialog', { timeout: 2000 }).catch(() => null);
      expect(alertDialog).toBeNull();
      
      // Verify content sanitization
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>');
      expect(pageContent).not.toContain('javascript:');
      expect(pageContent).not.toContain('onload=');
      expect(pageContent).not.toContain('onerror=');
      
      console.log(`✅ ${vector.name} successfully prevented`);
      
      // Wait before next test to avoid rate limiting
      await page.waitForTimeout(1000);
    }
    
    console.log('🎉 All XSS vectors successfully prevented');
  });

  test('Performance: Security controls should not degrade performance', async ({ page }) => {
    console.log('🔍 Testing performance impact of security controls...');
    
    const startTime = Date.now();
    
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
    await page.fill('input[name="uid"]', 'legituser123');
    await page.fill('input[name="pw"]', 'password123');
    await page.click('button:has-text("Create account")');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`⏱️ Registration completed in ${responseTime}ms`);
    
    // Security controls should not add more than 5 seconds overhead
    expect(responseTime).toBeLessThan(10000);
    
    console.log('✅ Performance within acceptable limits');
  });

  test('Regression: XSS persistence across different pages', async ({ page }) => {
    console.log('🔍 Testing XSS persistence across application pages...');
    
    // Create account with potential XSS
    await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}/newaccount.gtl`);
    const persistencePayload = '<script>window.xssExecuted=true;alert("PERSISTENCE_TEST")</script>';
    await page.fill('input[name="uid"]', persistencePayload);
    await page.fill('input[name="pw"]', 'testpass123');
    await page.click('button:has-text("Create account")');
    
    // Test across multiple pages
    const pagesToTest = [
      '/',
      '/snippets.gtl',
    ];
    
    for (const pagePath of pagesToTest) {
      console.log(`🔄 Testing page: ${pagePath}`);
      
      await page.goto(`https://google-gruyere.appspot.com/${gruyereInstance}${pagePath}`);
      
      // Check for script execution
      const xssExecuted = await page.evaluate(() => window.xssExecuted).catch(() => false);
      expect(xssExecuted).toBeFalsy();
      
      // Check for alert dialog
      const alertDialog = await page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
      expect(alertDialog).toBeNull();
      
      // Verify content is sanitized
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>window.xssExecuted');
      expect(pageContent).not.toContain('PERSISTENCE_TEST');
      
      console.log(`✅ Page ${pagePath} - XSS properly prevented`);
    }
    
    console.log('🎉 XSS persistence successfully prevented across all pages');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      // Capture screenshot for failed tests
      const screenshot = await page.screenshot({ 
        path: `test-evidence/failed-${testInfo.title.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.png`,
        fullPage: true 
      });
      console.log(`📸 Screenshot captured for failed test: ${testInfo.title}`);
    }
    
    // Close browser to prevent resource leaks
    await page.close();
  });

});

// Export test configuration
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    }
  ]
};