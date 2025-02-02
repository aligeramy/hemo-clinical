import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse'
import { createReadStream } from 'fs'
import { encrypt } from '../lib/encryption.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function migrateData() {
  console.log('Starting data migration...')
  
  const csvPath = path.join(dirname(__dirname), 'public', 'patient-data.csv')
  // ... rest of the code stays the same
}

migrateData()
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1) 