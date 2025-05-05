/**
 * Setup Script
 * 
 * This script will run the collection creation and data import scripts
 * after prompting for admin credentials.
 */
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('========================================');
console.log('Historical Library PocketBase Data Setup');
console.log('========================================');
console.log('\nThis script will:');
console.log('1. Create necessary collections in PocketBase');
console.log('2. Import test data into those collections');
console.log('\nPlease provide your PocketBase admin credentials:');

rl.question('Admin Email: ', (email) => {
  rl.question('Admin Password: ', (password) => {
    console.log('\nStarting collection creation...');
    
    try {
      // Run the create-collections.js script with the provided credentials
      execSync(`PB_ADMIN_EMAIL="${email}" PB_ADMIN_PASSWORD="${password}" node create-collections.js`, { 
        stdio: 'inherit' 
      });
      
      console.log('\nStarting data import...');
      
      // Run the import.js script
      execSync('node import.js', { 
        stdio: 'inherit' 
      });
      
      console.log('\nSetup completed successfully!');
      console.log('\nYou can now access your PocketBase data at http://127.0.0.1:8090/_/');
    } catch (error) {
      console.error('\nAn error occurred during setup:', error.message);
    }
    
    rl.close();
  });
}); 