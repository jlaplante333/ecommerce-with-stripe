const { execSync } = require('child_process');

const categories = [
  'unit',
  'edge_cases', 
  'property_based',
  'fuzz',
  'mutation',
  'integration'
];

console.log('🧪 Test Runner Demo');
console.log('==================\n');

categories.forEach(category => {
  console.log(`Running ${category} tests...`);
  try {
    const result = execSync(`npx jest tests/${category}/**/*.test.js --json`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const output = JSON.parse(result);
    const passed = output.numPassedTests;
    const failed = output.numFailedTests;
    const total = output.numTotalTests;
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    console.log(`✅ ${category}: ${passed}/${total} passed (${percentage}%)`);
    
    if (failed > 0) {
      console.log(`❌ ${failed} tests failed`);
    }
  } catch (error) {
    console.log(`❌ Error running ${category} tests:`, error.message);
  }
  console.log('');
});

console.log('🎉 Test run completed!');
console.log('Visit http://localhost:3000/test-runner for the web interface'); 