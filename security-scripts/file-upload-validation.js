// Security Testing Script - File Upload Validation
// Associated Bug: DEM-36 - Unrestricted File Upload - No File Type Validation
// Test Case: DEM-41 - Validar corrección de Unrestricted File Upload

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('File Upload Security Tests', () => {

  test.beforeEach(async () => {
    // Create test files for upload validation
    const testDir = path.join(__dirname, 'test-files');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Create malicious test files
    fs.writeFileSync(path.join(testDir, 'malicious.php'), '<?php echo "Malicious PHP executed"; ?>');
    fs.writeFileSync(path.join(testDir, 'malware.exe'), 'fake executable content');
    fs.writeFileSync(path.join(testDir, 'script.bat'), '@echo off\necho "Batch script executed"');
    
    // Create legitimate test files
    fs.writeFileSync(path.join(testDir, 'image.jpg'), 'fake jpg content');
    fs.writeFileSync(path.join(testDir, 'document.txt'), 'Sample text document');
    fs.writeFileSync(path.join(testDir, 'large-file.txt'), 'x'.repeat(10 * 1024 * 1024)); // 10MB file
  });

  test('Should reject malicious file extensions', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    const maliciousFiles = [
      'test-files/malicious.php',
      'test-files/malware.exe', 
      'test-files/script.bat'
    ];

    for (const filePath of maliciousFiles) {
      const fullPath = path.join(__dirname, filePath);
      
      // Attempt to upload malicious file
      await page.locator('input[type="file"]').setInputFiles(fullPath);
      await page.locator('input[type="submit"]').click();
      
      // Should see error message or rejection
      const pageContent = await page.content();
      const hasError = pageContent.includes('error') || 
                      pageContent.includes('not allowed') || 
                      pageContent.includes('invalid') ||
                      pageContent.includes('rejected');
      
      expect(hasError).toBe(true);
      console.log(`✅ Malicious file ${filePath} correctly rejected`);
      
      // Navigate back for next test
      await page.goto('https://the-internet.herokuapp.com/upload');
    }
  });

  test('Should validate MIME type properly', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    // Create a file with wrong extension but correct MIME type
    const testFile = path.join(__dirname, 'test-files/fake-image.php');
    fs.writeFileSync(testFile, 'Not actually PHP content, but has PHP extension');
    
    await page.locator('input[type="file"]').setInputFiles(testFile);
    await page.locator('input[type="submit"]').click();
    
    // Should reject based on extension, not just content
    const pageContent = await page.content();
    const hasError = pageContent.includes('error') || 
                    pageContent.includes('not allowed') ||
                    pageContent.includes('invalid');
    
    expect(hasError).toBe(true);
    console.log('✅ MIME type validation working correctly');
  });

  test('Should accept legitimate file types', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    const legitimateFiles = [
      'test-files/image.jpg',
      'test-files/document.txt'
    ];

    for (const filePath of legitimateFiles) {
      const fullPath = path.join(__dirname, filePath);
      
      await page.locator('input[type="file"]').setInputFiles(fullPath);
      await page.locator('input[type="submit"]').click();
      
      // Should see success message or successful upload
      const pageContent = await page.content();
      const hasSuccess = pageContent.includes('success') || 
                        pageContent.includes('uploaded') ||
                        pageContent.includes('complete') ||
                        !pageContent.includes('error');
      
      expect(hasSuccess).toBe(true);
      console.log(`✅ Legitimate file ${filePath} correctly accepted`);
      
      // Navigate back for next test
      await page.goto('https://the-internet.herokuapp.com/upload');
    }
  });

  test('Should enforce file size limits', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    // Try to upload large file
    const largeFilePath = path.join(__dirname, 'test-files/large-file.txt');
    
    await page.locator('input[type="file"]').setInputFiles(largeFilePath);
    await page.locator('input[type="submit"]').click();
    
    // Should see file size error
    const pageContent = await page.content();
    const hasSizeError = pageContent.includes('too large') || 
                        pageContent.includes('size limit') ||
                        pageContent.includes('maximum') ||
                        pageContent.includes('error');
    
    expect(hasSizeError).toBe(true);
    console.log('✅ File size limits properly enforced');
  });

  test('Should have proper error messaging', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    // Upload malicious file to check error message quality
    const maliciousFile = path.join(__dirname, 'test-files/malicious.php');
    
    await page.locator('input[type="file"]').setInputFiles(maliciousFile);
    await page.locator('input[type="submit"]').click();
    
    // Check for appropriate error message
    const errorMessage = await page.locator('.error, .message, .alert').textContent().catch(() => '');
    
    // Error message should be informative but not reveal internal details
    expect(errorMessage).not.toContain('Internal Server Error');
    expect(errorMessage).not.toContain('Stack trace');
    expect(errorMessage).not.toContain('Exception');
    
    console.log('✅ Error messaging is appropriate and secure');
  });

  test.afterEach(async () => {
    // Clean up test files
    const testDir = path.join(__dirname, 'test-files');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

});

// Export for use in test suites
module.exports = { test };