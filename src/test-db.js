const { readConnection, writeConnection, DB_NAME } = require('./config/database');

async function testConnections() {
  console.log(`Database target: ${DB_NAME}`);
  
  setTimeout(() => {
    console.log(`Read connection readyState: ${readConnection.readyState}`);
    console.log(`Write connection readyState: ${writeConnection.readyState}`);
    process.exit(0);
  }, 4000);
}

testConnections();
