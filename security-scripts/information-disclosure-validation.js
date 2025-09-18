// Security Testing Script - Information Disclosure Validation
// Associated Bug: DEM-35 - Information Disclosure - Hard-coded Credentials Exposed
// Test Case: DEM-40 - Validar corrección de Information Disclosure en Login Page

const { test, expect } = require('@playwright/test');

test.describe('Information Disclosure Security Tests', () => {
  
  test('Should not expose credentials in login page text', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Get page content
    const pageContent = await page.content();
    
    // Check that sensitive credentials are not exposed in visible text
    const pageText = await page.locator('body').textContent();
    
    // Verify credentials are not visible in page text
    expect(pageText).not.toContain('tomsmith');
    expect(pageText).not.toContain('SuperSecretPassword!');
    
    // Check specific instruction text areas
    const instructionElements = await page.locator('h4, p, .instructions').all();
    
    for (const element of instructionElements) {
      const text = await element.textContent();
      expect(text).not.toContain('tomsmith');
      expect(text).not.toContain('SuperSecretPassword!');
    }
    
    // Verify no credentials in HTML source
    expect(pageContent).not.toContain('tomsmith');
    expect(pageContent).not.toContain('SuperSecretPassword!');
    
    // Ensure form is still functional (fields exist)
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('✅ Information Disclosure test passed - No credentials exposed');
  });

  test('Should not expose credentials in HTML comments', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Get full HTML source
    const htmlSource = await page.content();
    
    // Check for credentials in HTML comments
    const commentPattern = /<!--[\s\S]*?-->/g;
    const comments = htmlSource.match(commentPattern) || [];
    
    for (const comment of comments) {
      expect(comment).not.toContain('tomsmith');
      expect(comment).not.toContain('SuperSecretPassword!');
    }
    
    console.log('✅ No credentials found in HTML comments');
  });

  test('Should not expose credentials in JavaScript variables', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Check for credentials in JavaScript context
    const jsCredentials = await page.evaluate(() => {
      // Check common global variables where credentials might be stored
      const checks = [
        window.username,
        window.password,
        window.credentials,
        window.defaultUser,
        window.testUser
      ];
      
      return checks.some(value => 
        typeof value === 'string' && 
        (value.includes('tomsmith') || value.includes('SuperSecretPassword!'))
      );
    });
    
    expect(jsCredentials).toBe(false);
    console.log('✅ No credentials exposed in JavaScript variables');
  });

  test('Should have secure login instructions', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    
    // Check that instructions are generic and secure
    const instructionText = await page.locator('h4').textContent();
    
    // Instructions should be generic, not expose specific credentials
    expect(instructionText).not.toMatch(/username.*tomsmith/i);
    expect(instructionText).not.toMatch(/password.*SuperSecretPassword/i);
    
    // Should contain generic security guidance
    const expectedGenericTerms = ['login', 'credentials', 'username', 'password'];
    const hasGenericTerms = expectedGenericTerms.some(term => 
      instructionText.toLowerCase().includes(term)
    );
    
    expect(hasGenericTerms).toBe(true);
    console.log('✅ Login instructions are appropriately generic');
  });
  
});

// Export for use in test suites
module.exports = { test };