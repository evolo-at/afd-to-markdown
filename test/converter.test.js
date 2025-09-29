const fs = require('fs');
const path = require('path');

// Simple test runner
async function runTest() {
  try {
    // Import the converter
    const { convertADFToMarkdown } = require('../dist/index.js');

    // Read the test ADF file
    const adfPath = path.join(__dirname, '..', 'adf-example.json');
    const adfContent = fs.readFileSync(adfPath, 'utf8');
    const adf = JSON.parse(adfContent);

    console.log('Converting ADF to Markdown...\n');
    console.log('='.repeat(80));

    // Convert
    const markdown = convertADFToMarkdown(adf);

    // Output the result
    console.log(markdown);

    console.log('='.repeat(80));
    console.log('\n✓ Conversion completed successfully!');

    // Write output to file
    const outputPath = path.join(__dirname, '..', 'output.md');
    fs.writeFileSync(outputPath, markdown, 'utf8');
    console.log(`\nOutput written to: ${outputPath}`);

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTest();