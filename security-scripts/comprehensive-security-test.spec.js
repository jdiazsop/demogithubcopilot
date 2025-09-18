// Comprehensive Security Testing Suite
// Shift-Right Testing Implementation
// Associated with: DEM-45 (XSS Bug) and DEM-46 (Test Case)

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class SecurityTestReporter {
  constructor() {
    this.testResults = [];
    this.vulnerabilities = [];
    this.recommendations = [];
  }

  addTestResult(testName, status, details, risk = 'Medium') {
    const result = {
      timestamp: new Date().toISOString(),
      testName,
      status,
      details,
      risk,
      evidence: details.evidence || null
    };
    this.testResults.push(result);
  }

  addVulnerability(type, description, location, risk, recommendation) {
    const vulnerability = {
      id: `VULN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      location,
      risk,
      recommendation,
      discovered: new Date().toISOString()
    };
    this.vulnerabilities.push(vulnerability);
  }

  generateReport() {
    const report = {
      executionSummary: {
        timestamp: new Date().toISOString(),
        totalTests: this.testResults.length,
        passed: this.testResults.filter(t => t.status === 'PASS').length,
        failed: this.testResults.filter(t => t.status === 'FAIL').length,
        vulnerabilitiesFound: this.vulnerabilities.length
      },
      testResults: this.testResults,
      vulnerabilities: this.vulnerabilities,
      recommendations: this.recommendations
    };

    // Save to file
    const reportPath = path.join(__dirname, '..', 'test-results', `security-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Security report generated: ${reportPath}`);
    return report;
  }
}

test.describe('Comprehensive Security Testing Suite - Shift-Right Implementation', () => {
  
  let reporter;
  let gruyereInstance;
  let baseUrl;

  test.beforeAll(async () => {
    reporter = new SecurityTestReporter();
    console.log('🚀 Starting Comprehensive Security Testing Suite');
    console.log('🎯 Target: Google Gruyere Application');
    console.log('📋 Associated Issues: DEM-45 (Bug), DEM-46 (Test Case)');
  });

  test.beforeEach(async ({ page }) => {
    // Initialize fresh Gruyere instance for each test
    await page.goto('https://google-gruyere.appspot.com/start');
    await page.click('text=Agree & Start');
    
    const currentUrl = page.url();
    const instanceMatch = currentUrl.match(/\/(\d+)\//);
    gruyereInstance = instanceMatch ? instanceMatch[1] : null;
    baseUrl = `https://google-gruyere.appspot.com/${gruyereInstance}`;
    
    console.log(`🔧 Testing instance: ${gruyereInstance}`);
  });

  // ==========================================
  // XSS VULNERABILITY TESTING (Priority: Critical)
  // ==========================================

  test('CRITICAL: Stored XSS in User Registration', async ({ page }) => {
    const testName = 'Stored XSS - User Registration';
    console.log(`🔍 Executing: ${testName}`);

    try {
      await page.goto(`${baseUrl}/newaccount.gtl`);
      
      // Test basic XSS payload
      const xssPayload = '<script>alert("XSS_VULNERABILITY_DETECTED")</script>';
      await page.fill('input[name="uid"]', xssPayload);
      await page.fill('input[name="pw"]', 'testpassword');
      await page.click('button:has-text("Create account")');
      
      // Navigate to check for execution
      await page.goto(`${baseUrl}/`);
      
      // Check for alert dialog (indicates vulnerability)
      const alertDialog = await page.waitForEvent('dialog', { timeout: 3000 }).catch(() => null);
      
      if (alertDialog) {
        // VULNERABILITY FOUND
        reporter.addVulnerability(
          'Stored Cross-Site Scripting (XSS)',
          'User registration form allows script injection in username field',
          `${baseUrl}/newaccount.gtl`,
          'Critical',
          'Implement input validation and output encoding'
        );
        reporter.addTestResult(testName, 'FAIL', {
          evidence: 'Alert dialog triggered, indicating script execution',
          payload: xssPayload,
          location: 'Username field in registration form'
        }, 'Critical');
        
        await alertDialog.dismiss();
        console.log('🚨 CRITICAL: Stored XSS vulnerability detected');
      } else {
        // Check if script appears in page content (another form of vulnerability)
        const pageContent = await page.content();
        if (pageContent.includes('<script>alert(') || pageContent.includes('XSS_VULNERABILITY_DETECTED')) {
          reporter.addVulnerability(
            'Stored Cross-Site Scripting (XSS)',
            'Script content stored and displayed without proper sanitization',
            `${baseUrl}/`,
            'Critical',
            'Implement output encoding and Content Security Policy'
          );
          reporter.addTestResult(testName, 'FAIL', {
            evidence: 'Script content visible in page source',
            payload: xssPayload
          }, 'Critical');
          console.log('🚨 CRITICAL: XSS payload stored in application');
        } else {
          reporter.addTestResult(testName, 'PASS', {
            evidence: 'XSS payload properly sanitized',
            payload: xssPayload
          });
          console.log('✅ XSS properly prevented');
        }
      }
    } catch (error) {
      reporter.addTestResult(testName, 'ERROR', {
        error: error.message,
        evidence: 'Test execution failed'
      });
      console.log(`❌ Test error: ${error.message}`);
    }
  });

  test('HIGH: Reflected XSS in URL Parameters', async ({ page }) => {
    const testName = 'Reflected XSS - URL Parameters';
    console.log(`🔍 Executing: ${testName}`);

    try {
      const reflectedXSSPayload = '<script>alert("REFLECTED_XSS")</script>';
      const testUrl = `${baseUrl}/login?error=${encodeURIComponent(reflectedXSSPayload)}`;
      
      await page.goto(testUrl);
      
      const alertDialog = await page.waitForEvent('dialog', { timeout: 3000 }).catch(() => null);
      
      if (alertDialog) {
        reporter.addVulnerability(
          'Reflected Cross-Site Scripting (XSS)',
          'URL parameters reflected without proper encoding',
          testUrl,
          'High',
          'Validate and encode all URL parameters before display'
        );
        reporter.addTestResult(testName, 'FAIL', {
          evidence: 'Alert dialog from reflected XSS',
          payload: reflectedXSSPayload,
          url: testUrl
        }, 'High');
        
        await alertDialog.dismiss();
        console.log('🚨 HIGH: Reflected XSS vulnerability detected');
      } else {
        reporter.addTestResult(testName, 'PASS', {
          evidence: 'URL parameters properly handled',
          url: testUrl
        });
        console.log('✅ Reflected XSS properly prevented');
      }
    } catch (error) {
      reporter.addTestResult(testName, 'ERROR', { error: error.message });
      console.log(`❌ Test error: ${error.message}`);
    }
  });

  // ==========================================
  // AUTHENTICATION & AUTHORIZATION TESTING
  // ==========================================

  test('MEDIUM: Authentication Bypass Attempt', async ({ page }) => {
    const testName = 'Authentication Bypass - SQL Injection';
    console.log(`🔍 Executing: ${testName}`);

    try {
      await page.goto(`${baseUrl}/login`);
      
      // SQL injection attempts
      const sqlPayloads = [
        "admin' OR '1'='1",
        "admin' OR '1'='1' --",
        "admin' OR 1=1 #",
        "' UNION SELECT 1,1,1 --"
      ];

      for (const payload of sqlPayloads) {
        await page.fill('input[name="uid"]', payload);
        await page.fill('input[name="pw"]', 'anything');
        await page.click('button:has-text("Login")');
        
        // Check if login was successful (would indicate SQL injection vulnerability)
        const currentUrl = page.url();
        const pageContent = await page.content();
        
        if (currentUrl.includes('account') || pageContent.includes('Welcome') || pageContent.includes('logout')) {
          reporter.addVulnerability(
            'SQL Injection - Authentication Bypass',
            'Login form vulnerable to SQL injection allowing authentication bypass',
            `${baseUrl}/login`,
            'Critical',
            'Implement parameterized queries and input validation'
          );
          reporter.addTestResult(testName, 'FAIL', {
            evidence: 'Authentication bypassed with SQL injection',
            payload: payload,
            resultUrl: currentUrl
          }, 'Critical');
          console.log('🚨 CRITICAL: SQL injection vulnerability detected');
          break;
        }
      }
      
      // If no bypass detected
      if (!reporter.testResults.some(r => r.testName === testName && r.status === 'FAIL')) {
        reporter.addTestResult(testName, 'PASS', {
          evidence: 'Authentication bypass attempts failed',
          payloadsTested: sqlPayloads.length
        });
        console.log('✅ Authentication bypass properly prevented');
      }
    } catch (error) {
      reporter.addTestResult(testName, 'ERROR', { error: error.message });
      console.log(`❌ Test error: ${error.message}`);
    }
  });

  // ==========================================
  // SECURITY HEADERS VALIDATION
  // ==========================================

  test('MEDIUM: Security Headers Implementation', async ({ page }) => {
    const testName = 'Security Headers Validation';
    console.log(`🔍 Executing: ${testName}`);

    try {
      const response = await page.goto(`${baseUrl}/`);
      const headers = response.headers();
      
      const requiredHeaders = {
        'content-security-policy': 'Content Security Policy',
        'x-xss-protection': 'XSS Protection',
        'x-content-type-options': 'Content Type Options',
        'x-frame-options': 'Frame Options',
        'strict-transport-security': 'HTTP Strict Transport Security'
      };

      const missingHeaders = [];
      const implementedHeaders = [];

      for (const [header, description] of Object.entries(requiredHeaders)) {
        if (headers[header]) {
          implementedHeaders.push({ header, value: headers[header], description });
          console.log(`✅ ${description}: ${headers[header]}`);
        } else {
          missingHeaders.push({ header, description });
          console.log(`⚠️ Missing: ${description}`);
        }
      }

      if (missingHeaders.length > 0) {
        reporter.addVulnerability(
          'Missing Security Headers',
          `Application lacks important security headers: ${missingHeaders.map(h => h.description).join(', ')}`,
          `${baseUrl}/`,
          'Medium',
          'Implement all recommended security headers'
        );
        reporter.addTestResult(testName, 'FAIL', {
          evidence: `${missingHeaders.length} security headers missing`,
          missingHeaders: missingHeaders,
          implementedHeaders: implementedHeaders
        }, 'Medium');
        console.log(`🚨 MEDIUM: ${missingHeaders.length} security headers missing`);
      } else {
        reporter.addTestResult(testName, 'PASS', {
          evidence: 'All required security headers implemented',
          implementedHeaders: implementedHeaders
        });
        console.log('✅ All security headers properly implemented');
      }
    } catch (error) {
      reporter.addTestResult(testName, 'ERROR', { error: error.message });
      console.log(`❌ Test error: ${error.message}`);
    }
  });

  // ==========================================
  // INFORMATION DISCLOSURE TESTING
  // ==========================================

  test('LOW: Information Disclosure - Error Messages', async ({ page }) => {
    const testName = 'Information Disclosure - Error Handling';
    console.log(`🔍 Executing: ${testName}`);

    try {
      // Test various endpoints for information disclosure
      const testEndpoints = [
        '/admin',
        '/config',
        '/debug',
        '/error',
        '/../etc/passwd',
        '/backup.sql'
      ];

      const disclosureFound = [];

      for (const endpoint of testEndpoints) {
        try {
          const response = await page.goto(`${baseUrl}${endpoint}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
          const content = await page.content().catch(() => '');
          
          // Check for sensitive information patterns
          const sensitivePatterns = [
            /stack trace/i,
            /database error/i,
            /mysql/i,
            /postgresql/i,
            /sql error/i,
            /internal server error/i,
            /debug mode/i,
            /root@/i,
            /administrator/i
          ];

          for (const pattern of sensitivePatterns) {
            if (pattern.test(content)) {
              disclosureFound.push({
                endpoint: endpoint,
                pattern: pattern.source,
                status: response.status()
              });
              break;
            }
          }
        } catch (e) {
          // Endpoint not accessible, which is expected
          continue;
        }
      }

      if (disclosureFound.length > 0) {
        reporter.addVulnerability(
          'Information Disclosure',
          'Application reveals sensitive information in error messages or accessible endpoints',
          `${baseUrl}`,
          'Low',
          'Implement generic error messages and proper access controls'
        );
        reporter.addTestResult(testName, 'FAIL', {
          evidence: `Information disclosure found in ${disclosureFound.length} endpoints`,
          disclosures: disclosureFound
        }, 'Low');
        console.log(`🚨 LOW: Information disclosure detected`);
      } else {
        reporter.addTestResult(testName, 'PASS', {
          evidence: 'No information disclosure detected',
          endpointsTested: testEndpoints.length
        });
        console.log('✅ No information disclosure detected');
      }
    } catch (error) {
      reporter.addTestResult(testName, 'ERROR', { error: error.message });
      console.log(`❌ Test error: ${error.message}`);
    }
  });

  test.afterAll(async () => {
    // Generate comprehensive security report
    const report = reporter.generateReport();
    
    console.log('\n🎉 Security Testing Completed!');
    console.log('===============================================');
    console.log(`📊 Total Tests Executed: ${report.executionSummary.totalTests}`);
    console.log(`✅ Tests Passed: ${report.executionSummary.passed}`);
    console.log(`❌ Tests Failed: ${report.executionSummary.failed}`);
    console.log(`🚨 Vulnerabilities Found: ${report.executionSummary.vulnerabilitiesFound}`);
    console.log('===============================================');

    if (report.vulnerabilities.length > 0) {
      console.log('\n🚨 VULNERABILITIES DETECTED:');
      report.vulnerabilities.forEach((vuln, index) => {
        console.log(`${index + 1}. ${vuln.type} (${vuln.risk})`);
        console.log(`   Location: ${vuln.location}`);
        console.log(`   Description: ${vuln.description}`);
        console.log(`   Recommendation: ${vuln.recommendation}\n`);
      });
    }

    console.log(`\n📋 Detailed report saved to: test-results/security-report-${Date.now()}.json`);
    console.log('🔗 Associated Jira Issues: DEM-45 (Bug), DEM-46 (Test Case)');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      // Capture evidence for failed tests
      const timestamp = Date.now();
      const testNameSafe = testInfo.title.replace(/[^a-z0-9]/gi, '_');
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-results/evidence/screenshot-${testNameSafe}-${timestamp}.png`,
        fullPage: true 
      }).catch(() => {});
      
      // Save page content
      const content = await page.content().catch(() => '');
      if (content) {
        fs.writeFileSync(
          `test-results/evidence/content-${testNameSafe}-${timestamp}.html`,
          content
        );
      }
      
      console.log(`📸 Evidence captured for: ${testInfo.title}`);
    }
  });

});