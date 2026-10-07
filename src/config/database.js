const mongoose = require('mongoose');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'DB_23ITB010';

function ensureTlsOption(uri) {
  if (!uri) return uri;
  if (!uri.includes('tlsAllowInvalidCertificates=true')) {
    const separator = uri.includes('?') ? '&' : '?';
    return `${uri}${separator}tlsAllowInvalidCertificates=true`;
  }
  return uri;
}

const baseClusterUri = process.env.CLUSTER_STRING 
  ? process.env.CLUSTER_STRING.replace('/?', `/${DB_NAME}?`) 
  : '';

const rawReadUri = process.env.MONGO_READ_URI || baseClusterUri;
const READ_URI = ensureTlsOption(rawReadUri);

const rawWriteUri = process.env.MONGO_WRITE_URI || baseClusterUri;
const WRITE_URI = ensureTlsOption(rawWriteUri);

const readConnection = mongoose.createConnection(READ_URI);

readConnection.on('connected', () => {
  console.log('MongoDB Read connection: connected');
});

readConnection.on('error', (err) => {
  console.warn('MongoDB Read connection error:', err.message);
});

const writeConnection = mongoose.createConnection(WRITE_URI);

writeConnection.on('connected', () => {
  console.log('MongoDB Write connection: connected');
});

writeConnection.on('error', (err) => {
  console.warn('MongoDB Write connection error:', err.message);
});

module.exports = {
  readConnection,
  writeConnection,
  DB_NAME,
  READ_URI,
  WRITE_URI,
  ensureTlsOption
};
