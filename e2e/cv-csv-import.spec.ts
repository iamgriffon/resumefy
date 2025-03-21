import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('CV CSV Import', () => {
  // Create fixtures directory if it doesn't exist
  test.beforeAll(async () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    // Create invalid test file if it doesn't exist
    const invalidFilePath = path.join(fixturesDir, 'invalid.txt');
    if (!fs.existsSync(invalidFilePath)) {
      fs.writeFileSync(invalidFilePath, 'This is not a CSV file');
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the resume builder page
    await page.goto('/en/resume-builder/import');
  });

  test('should display the CSV import page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Import Resume from CSV' })).toBeVisible();
    await expect(page.getByText('Upload a CSV file to import your resume data')).toBeVisible();
    await expect(page.getByTestId('csv-file-input')).toBeVisible();
  });

  test('should validate CSV file format', async ({ page }) => {
    // Create an invalid file (not a CSV)
    const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid.txt');
  
    // Make sure the input is visible and interactable before setting files
    await page.getByTestId('csv-file-input').waitFor({ state: 'visible' });
    await page.getByTestId('csv-file-input').setInputFiles(invalidFilePath);
    
    // Wait for file to be processed
    await page.waitForTimeout(500);
    
    await page.getByTestId('import-button').click();
    await expect(page.getByText('Please upload a valid CSV file')).toBeVisible();
  });

  test('should successfully import a valid CSV file', async ({ page }) => {
    // Use our sample CSV file
    const csvFilePath = path.join(__dirname, '../public/sample-resume.csv');
    
    // Wait for file input to be ready and upload the file
    await page.getByTestId('csv-file-input').waitFor({ state: 'visible' });
    await page.getByTestId('csv-file-input').setInputFiles(csvFilePath);
    
    // Wait for file to be processed and the button to be enabled
    await page.getByTestId('import-button').waitFor({ state: 'visible' });
    await expect(page.getByTestId('import-button')).toBeEnabled();
    
    await page.getByTestId('import-button').click();
    
    // Check if the data was imported correctly
    await page.waitForURL(/resume-builder\/preview/);
    await expect(page.getByTestId('fullName')).toBeVisible();
    await expect(page.getByTestId('email')).toBeVisible();
    await expect(page.getByTestId('location')).toBeVisible();
    await expect(page.getByTestId('summary')).toBeVisible();
    
    // Edit the imported data
    const editButton = page.getByTestId('edit-button');
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Check if we're redirected to the edit page
    await page.waitForURL(/resume-builder\/edit/);
    
    // Check if the edit form is visible with pre-filled data
    await expect(page.getByTestId('fullName-input')).toBeVisible();
  });

  test('should handle CSV files with missing fields gracefully', async ({ page }) => {
    // Create fixtures directory if needed
    const fixturesDir = path.join(__dirname, '..', 'fixtures');
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }
    
    // Create or ensure incomplete CSV file exists
    const incompleteCSVPath = path.join(fixturesDir, 'incomplete-resume.csv');
    if (!fs.existsSync(incompleteCSVPath)) {
      fs.writeFileSync(incompleteCSVPath, 'fullName,email\nJohn Doe,john@example.com');
    }
    
    // Upload the file
    await page.getByTestId('csv-file-input').waitFor({ state: 'visible' });
    await page.getByTestId('csv-file-input').setInputFiles(incompleteCSVPath);
    
    // Wait for file to be processed and the button to be enabled
    await page.getByTestId('import-button').waitFor({ state: 'visible' });
    await expect(page.getByTestId('import-button')).toBeEnabled();
    
    await page.getByTestId('import-button').click();
    
    // Check if the data was imported with proper fallbacks
    await page.waitForURL(/resume-builder\/preview/);
    await expect(page.getByText('Missing fields in CSV file')).toBeVisible();
    
    // Verify that available fields were imported
    await page.getByTestId('edit-button').click();
    await expect(page.getByTestId('fullName-input')).not.toBeEmpty();
  });
}); 