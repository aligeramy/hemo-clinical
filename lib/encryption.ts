import crypto from 'crypto'

const ENCRYPTION_KEY = "Xjpiaplt95aGafOzca6NcIFscIFTtxPc"
const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'utf8')

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Return IV:AuthTag:EncryptedData
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
} 