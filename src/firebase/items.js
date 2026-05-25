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
import { db } from './config'

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

export async function createItem(userId, data) {
  const colRef = collection(db, itemsCollectionPath(userId))
  const docRef = await addDoc(colRef, {
    ...stripForFirestore(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateItem(userId, itemId, data) {
  const docRef = doc(db, itemsCollectionPath(userId), itemId)
  await updateDoc(docRef, {
    ...stripForFirestore(data),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteItem(userId, itemId) {
  await deleteDoc(doc(db, itemsCollectionPath(userId), itemId))
}

function stripForFirestore(data) {
  const { id, createdAt, updatedAt, imageUrl, ...rest } = data
  return rest
}
