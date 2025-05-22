const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto
  .createHash('sha256')
  .update('your-secret-password') // 你可以存到 config.js
  .digest(); // 32 bytes key

const IV = Buffer.from('a1b2c3d4e5f6g7h8'); // 16 bytes固定IV（或傳入動態IV）

function encrypt(data) {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt(base64) {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
  let decrypted = decipher.update(base64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

module.exports = { encrypt, decrypt };
