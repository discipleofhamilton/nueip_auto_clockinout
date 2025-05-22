const { encrypt } = require('./aes');

const encrypted = encrypt({
  company: 'your_company',
  account: 'your_account',
  password: 'your_password',
});

console.log(encrypted); // output base64 string, copy the string into iPhone Shortcut
