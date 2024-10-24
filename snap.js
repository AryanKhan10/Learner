

// Generate a secret key using speakeasy
const secret = speakeasy.generateSecret({ length: 20 });

// Generate the OTP
const otp = speakeasy.totp({ secret: secret.base32, encoding: 'base32',digits: 6  });
