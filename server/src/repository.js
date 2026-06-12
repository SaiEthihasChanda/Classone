/**
 * Repository — the ONLY place that knows how the data store works.
 *
 * Routes and seeds depend on this interface, never on the Mongo driver. To move
 * to Firebase later, write a firestoreRepository.js exposing the same methods
 * and swap `createRepository`. Both Mongo and Firestore are document stores
 * (collections of schemaless docs), so the interface maps cleanly to either.
 *
 * Interface:
 *   list(name, { sort, limit })   → array of docs
 *   get(name, idField, id)        → one doc or null
 *   create(name, doc)             → inserted doc
 *   update(name, idField, id, patch) → updated doc or null
 *   remove(name, idField, id)     → boolean
 *   replaceAll(name, docs)        → seed helper (wipe + insert)
 */
import { ObjectId } from 'mongodb'
import { getDb } from './db.js'

function publicId(idField, id) {
  if (idField === '_id') {
    try { return new ObjectId(String(id)) } catch { return id }
  }
  return id
}

function clean(doc) {
  if (!doc) return doc
  // Expose Mongo _id as a string `id`; keep everything else as-is.
  const { _id, ...rest } = doc
  return { id: _id ? String(_id) : undefined, ...rest }
}

export function createMongoRepository() {
  return {
    async list(name, { sort, limit } = {}) {
      const cursor = getDb().collection(name).find({})
      if (sort) cursor.sort(sort)
      else cursor.sort({ order: 1, _id: 1 })
      if (limit) cursor.limit(limit)
      const docs = await cursor.toArray()
      return docs.map(clean)
    },

    async get(name, idField, id) {
      const query = idField === '_id'
        ? { _id: publicId(idField, id) }
        : { [idField]: id }
      const doc = await getDb().collection(name).findOne(query)
      return clean(doc)
    },

    async create(name, doc) {
      const toInsert = { ...doc }
      delete toInsert.id
      const res = await getDb().collection(name).insertOne(toInsert)
      return clean({ _id: res.insertedId, ...toInsert })
    },

    async update(name, idField, id, patch) {
      const query = idField === '_id'
        ? { _id: publicId(idField, id) }
        : { [idField]: id }
      const set = { ...patch }
      delete set.id
      delete set._id
      const res = await getDb().collection(name).findOneAndUpdate(
        query,
        { $set: set },
        { returnDocument: 'after' },
      )
      return clean(res)
    },

    async remove(name, idField, id) {
      const query = idField === '_id'
        ? { _id: publicId(idField, id) }
        : { [idField]: id }
      const res = await getDb().collection(name).deleteOne(query)
      return res.deletedCount > 0
    },

    // Seed helper: replace a whole collection's contents.
    async replaceAll(name, docs) {
      const col = getDb().collection(name)
      await col.deleteMany({})
      if (docs.length) await col.insertMany(docs.map((d, i) => ({ order: i, ...d })))
      return docs.length
    },
  }
}

// Single shared instance. Swap this line for a Firestore repo later.
export const repository = createMongoRepository()
