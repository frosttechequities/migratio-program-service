// This file is used to test the app with a simplified version
// Run this file with: node runTest.js

const fs = require('fs');
const path = require('path');

// Backup the original index.js
const indexPath = path.join(__dirname, 'index.js');
const backupPath = path.join(__dirname, 'index.js.backup');

// Create a backup if it doesn't exist
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(indexPath, backupPath);
  console.log('Created backup of index.js');
}

// Replace index.js with simpleIndex.js content
const simpleIndexPath = path.join(__dirname, 'simpleIndex.js');
const simpleIndexContent = fs.readFileSync(simpleIndexPath, 'utf8');
fs.writeFileSync(indexPath, simpleIndexContent);
console.log('Replaced index.js with simpleIndex.js content');

console.log('Now you can run "npm start" to test the simplified app');
console.log('After testing, run "node restoreIndex.js" to restore the original index.js');

// Create a restore script
const restoreScriptPath = path.join(__dirname, 'restoreIndex.js');
const restoreScriptContent = `
// This file is used to restore the original index.js
// Run this file with: node restoreIndex.js

const fs = require('fs');
const path = require('path');

// Restore the original index.js
const indexPath = path.join(__dirname, 'index.js');
const backupPath = path.join(__dirname, 'index.js.backup');

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, indexPath);
  console.log('Restored original index.js');
} else {
  console.error('Backup file not found');
}
`;

fs.writeFileSync(restoreScriptPath, restoreScriptContent);
console.log('Created restore script at restoreIndex.js');
