// Encryptor-Decryptor imports
require("dotenv").config();
const crypto = require('crypto');
const iv = crypto.randomBytes(parseInt(process.env.iv));
const algorithm = process.env.algorithm;
crypto_key=process.env.crypto_key;

// Encryption function
const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, crypto_key, iv);
    
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

// Decryption function
const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(process.env.algorithm, process.env.crypto_key, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
