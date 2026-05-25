import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './config'

export function itemsCollectionPath(userId) {
  return `users/${userId}/items`
}

export function subscribeToItems(userId, onData, onError) {
  const q = query(
    collection(db, itemsCollectionPath(userId)),
    orderBy('updatedAt', 'desc'),
  )
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
      onData(items)
    },
    onError,
  )
}

export async function createItem(userId, data, imageFile) {
  let imageUrl = data.imageUrl || ''
  const colRef = collection(db, itemsCollectionPath(userId))
  const docRef = await addDoc(colRef, {
    ...stripForFirestore(data),
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  if (imageFile) {
    imageUrl = await uploadItemImage(userId, docRef.id, imageFile)
    await updateDoc(docRef, { imageUrl, updatedAt: serverTimestamp() })
  }
  return docRef.id
}

export async function updateItem(userId, itemId, data, imageFile) {
  const docRef = doc(db, itemsCollectionPath(userId), itemId)
  const payload = { ...stripForFirestore(data), updatedAt: serverTimestamp() }
  if (imageFile) {
    payload.imageUrl = await uploadItemImage(userId, itemId, imageFile)
  }
  await updateDoc(docRef, payload)
}

export async function deleteItem(userId, itemId, imageUrl) {
  if (imageUrl?.includes('firebasestorage.googleapis.com')) {
    try {
      await deleteObject(ref(storage, imageStoragePath(userId, itemId)))
    } catch {
      /* image may already be gone */
    }
  }
  await deleteDoc(doc(db, itemsCollectionPath(userId), itemId))
}

function imageStoragePath(userId, itemId) {
  return `users/${userId}/items/${itemId}/photo`
}

async function uploadItemImage(userId, itemId, file) {
  const storageRef = ref(storage, imageStoragePath(userId, itemId))
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

function stripForFirestore(data) {
  const { id, createdAt, updatedAt, ...rest } = data
  return rest
}
