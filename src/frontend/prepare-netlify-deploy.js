const fs = require('fs');
const path = require('path');

// Ensure the build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist. Run npm run build first.');
  process.exit(1);
}

// Copy _redirects to build directory
const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsTarget = path.join(buildDir, '_redirects');

try {
  fs.copyFileSync(redirectsSource, redirectsTarget);
  console.log('✅ _redirects file copied to build directory');
} catch (err) {
  console.error('Error copying _redirects file:', err);
}

// Copy netlify.toml to build directory
const netlifyTomlSource = path.join(__dirname, 'netlify.toml');
const netlifyTomlTarget = path.join(buildDir, 'netlify.toml');

try {
  fs.copyFileSync(netlifyTomlSource, netlifyTomlTarget);
  console.log('✅ netlify.toml file copied to build directory');
} catch (err) {
  console.error('Error copying netlify.toml file:', err);
}

console.log('✅ Deployment package prepared successfully!');
console.log('To deploy to Netlify:');
console.log('1. Go to https://app.netlify.com/drop');
console.log('2. Drag and drop the "build" folder');
console.log('3. Wait for deployment to complete');
