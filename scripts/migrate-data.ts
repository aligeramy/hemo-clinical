import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse'
import { createReadStream } from 'fs'
import { encrypt } from '../lib/encryption'
import path from 'path'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  }
})

async function migrateData() {
  console.log('Starting data migration...')
  
  const csvPath = path.join(process.cwd(), 'public', 'patient-data.csv')
  const parser = parse({
    columns: true,
    skip_empty_lines: true
  })

  const records: any[] = []

  const stream = createReadStream(csvPath)
    .pipe(parser)
    .on('data', (data) => {
      // Format the date from YYYYMMDD to YYYY-MM-DD
      const formattedDate = data['Study Date'].replace(
        /(\d{4})(\d{2})(\d{2})/,
        '$1-$2-$3'
      )

      const record = {
        // Encrypt sensitive fields
        patientName: encrypt(data['Patient Name']),
        patientId: encrypt(data['Patient ID']),
        patientBirthDate: encrypt(data['Patient Birth Date']),
        accessionNumber: encrypt(data['Accession Number']),
        studyInstanceUid: encrypt(data['Study Instance UID']),
        seriesInstanceUid: encrypt(data['Series Instance UID']),
        sopInstanceUid: encrypt(data['SOP Instance UID']),

        // Non-sensitive fields
        studyDate: new Date(formattedDate),
        studyTime: data['Study Time'],
        modality: data['Modality'],
        bodyPart: data['Body Part'] || 'N/A',
        institutionName: data['Institution Name'],
        manufacturer: data['Manufacturer'],
        studyDescription: data['Study Description'],
        seriesDescription: data['Series Description'] || '',
        studyId: data['Study ID'] || '',
        seriesNumber: data['Series Number'],
        sliceThickness: data['Slice Thickness'],
        imageType: data['Image Type'],
        instanceNumber: data['Instance Number'] 
          ? parseInt(data['Instance Number']) 
          : null,
        kvp: data['KVP'],
        pixelSpacing: data['Pixel Spacing'],
        protocolName: data['Protocol Name'],
        patientSex: data['Patient Sex'],
        patientAge: data['Patient Age'],
        patientWeight: data['Patient Weight'],
      }
      records.push(record)
    })

  return new Promise((resolve, reject) => {
    stream.on('end', async () => {
      console.log(`Processing ${records.length} records...`)
      
      try {
        // Clear existing data
        await prisma.patientStudy.deleteMany({})
        console.log('Cleared existing data')

        // Insert in batches of 100
        const batchSize = 100
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize)
          await prisma.patientStudy.createMany({
            data: batch
          })
          console.log(`Inserted records ${i + 1} to ${Math.min(i + batchSize, records.length)}`)
        }

        console.log('Migration completed successfully')
        resolve('Success')
      } catch (error) {
        console.error('Migration failed:', error)
        reject(error)
      } finally {
        await prisma.$disconnect()
      }
    })

    stream.on('error', (error) => {
      console.error('Error reading CSV:', error)
      reject(error)
    })
  })
}

// Run the migration
migrateData()
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  }) 