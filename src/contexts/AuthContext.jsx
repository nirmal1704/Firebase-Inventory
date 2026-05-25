import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase/config'
import { getAnalyticsIfSupported } from '../firebase/config'

const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    getAnalyticsIfSupported()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  function requireAuth() {
    if (!auth) throw new Error('Firebase is not configured. Add your .env file first.')
  }

  async function login(email, password) {
    requireAuth()
    setError(null)
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email, password, displayName) {
    requireAuth()
    setError(null)
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName?.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() })
    }
  }

  async function loginWithGoogle() {
    requireAuth()
    setError(null)
    await signInWithPopup(auth, googleProvider)
  }

  async function logout() {
    requireAuth()
    setError(null)
    await signOut(auth)
  }

  const value = {
    user,
    loading,
    error,
    setError,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
