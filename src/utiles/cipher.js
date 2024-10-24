import crypto from 'crypto';

// Define algorithm and key
const algorithm = 'aes-256-cbc';

// Make sure your encryption key is exactly 32 bytes long
const key = process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY) : crypto.randomBytes(32);
const iv = crypto.randomBytes(16); // Generate a random IV for each encryption

// Encrypt function
const encrypt = (text) => {
    try {
        console.log("Text to encrypt:", text);
        console.log("]encrypt iv:", iv);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        // Encrypt the data in parts
        let encrypted = cipher.update(text, 'utf8', 'hex');
        
        // Finalize encryption
        encrypted += cipher.final('hex');
        console.log("Encrypted data:", encrypted);
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error; // Rethrow the error after logging
    }
};

// Decrypt function
const decrypt = (encryptedData) => {
    
    try {
        console.log("Text to decrypt:", encryptedData);
        console.log(" decrypt iv:", encryptedData.iv);
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryptedData.iv, 'hex'));
        let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log("Decrypted data:", decrypted);
        return decrypted;
        
    } catch (error) {
        console.error("Failed to decrypt data:", error.message);
        throw error;
    }
    
};

export { encrypt, decrypt };
