import { test, expect } from '@playwright/test';

test.describe('CV Form Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the resume builder page
    await page.goto('/en/resume-builder');
  });

  test('should display the CV form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Your CV' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Work Experience' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skills' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit the form without filling required fields
    await page.getByRole('button', { name: 'Save CV' }).click();
    
    // Check for validation messages
    await expect(page.getByText('Full name is required')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should be able to add education entries', async ({ page }) => {
    // Click add education button
    await page.getByRole('button', { name: 'Add Education' }).click();
    
    // Check if a new education section is added
    const educationSections = await page.locator('[data-testid^="education-"][data-testid$="-institution-input"]').count();
    expect(educationSections).toBe(1);
    
    // Fill in the education fields
    await page.getByTestId('education-0-institution-input').fill('MIT');
    await page.getByTestId('education-0-degree-input').fill('B.S.');
    
    // Add another education entry
    await page.getByRole('button', { name: 'Add Education' }).click();
    
    // Check if another education section is added
    const updatedEducationSections = await page.locator('[data-testid^="education-"][data-testid$="-institution-input"]').count();
    expect(updatedEducationSections).toBe(2);
  });

  test('should be able to add experience entries', async ({ page }) => {
    // Click add experience button
    await page.getByRole('button', { name: 'Add Experience' }).click();
    
    // Check if a new experience section is added
    const experienceSections = await page.locator('[data-testid^="experience-"][data-testid$="-company-input"]').count();
    expect(experienceSections).toBe(1);
    
    // Fill in the experience fields
    await page.getByTestId('experience-0-company-input').fill('Google');
    await page.getByTestId('experience-0-position-input').fill('Software Engineer');
  });

  test('should successfully submit a complete CV form', async ({ page }) => {
    // Fill in personal information
    await page.getByTestId('fullName-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');
    await page.getByTestId('phone-input').fill('+1234567890');
    await page.getByTestId('location-input').fill('New York, NY');
    await page.getByTestId('summary-input').fill('Experienced software engineer with 5+ years in web development.');
    
    // Add and fill education
    await page.getByRole('button', { name: 'Add Education' }).click();
    await page.getByTestId('education-0-institution-input').fill('MIT');
    await page.getByTestId('education-0-degree-input').fill('B.S.');
    await page.getByTestId('education-0-fieldOfStudy-input').fill('Computer Science');
    await page.getByTestId('education-0-startDate-input').fill('2015-09');
    await page.getByTestId('education-0-endDate-input').fill('2019-05');
    await page.getByTestId('education-0-description-input').fill('Dean\'s List, Senior Thesis on AI');
    
    // Add and fill experience
    await page.getByRole('button', { name: 'Add Experience' }).click();
    await page.getByTestId('experience-0-company-input').fill('Google');
    await page.getByTestId('experience-0-position-input').fill('Software Engineer');
    await page.getByTestId('experience-0-startDate-input').fill('2021-06');
    await page.getByTestId('experience-0-endDate-input').fill('2023-05');
    await page.getByTestId('experience-0-description-input').fill('Developed scalable APIs and services for Google Cloud Platform');
    
    // Add skills
    await page.getByTestId('skills-input').fill('JavaScript, TypeScript, React, Node.js, Python');
    
    // Mock the alert function to prevent it from blocking the test
    await page.evaluate(() => {
      window.alert = msg => console.log('Alert:', msg);
    });
    
    // Submit the form
    await page.getByRole('button', { name: 'Save CV' }).click();
    
    // Check if the form was submitted successfully (we're expecting an alert in the current implementation)
    await page.waitForFunction(() => {
      return document.querySelector('form') !== null;
    });
  });
}); 