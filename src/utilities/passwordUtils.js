import crypto from 'crypto'

function generateMD5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex')
}

// Function to compare hashed passwords
async function comparePassword(inputPassword, storedPassword) {
    return inputPassword === storedPassword
}

export {comparePassword, generateMD5Hash}
