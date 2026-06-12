/**
 * Database connection.
 *
 * - If MONGODB_URI is set (real MongoDB / Atlas / a future Firebase-backed
 *   gateway) we connect straight to it.
 * - Otherwise we boot a genuine local `mongod` via mongodb-memory-server,
 *   persisted to server/.data/db so documents survive restarts. This lets us
 *   prototype locally with zero system install.
 *
 * Nothing else in the app talks to the driver directly — everything goes
 * through the repository layer (see repository.js), so the store is swappable.
 */
import { MongoClient } from 'mongodb'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '..', '.data', 'db')
const DB_NAME = process.env.DB_NAME || 'classone'

let client
let db
let memoryServer

export async function connect() {
  if (db) return db

  let uri = process.env.MONGODB_URI

  if (!uri) {
    // No external Mongo configured → start a persisted local instance.
    fs.mkdirSync(DATA_DIR, { recursive: true })
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    memoryServer = await MongoMemoryServer.create({
      instance: { dbPath: DATA_DIR, storageEngine: 'wiredTiger', dbName: DB_NAME },
    })
    uri = memoryServer.getUri()
    console.log('[db] started local mongod (persisted) at', DATA_DIR)
  } else {
    console.log('[db] connecting to external MongoDB')
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db(DB_NAME)
  return db
}

export function getDb() {
  if (!db) throw new Error('Database not connected — call connect() first')
  return db
}

export async function disconnect() {
  await client?.close()
  await memoryServer?.stop()
  client = db = memoryServer = undefined
}
