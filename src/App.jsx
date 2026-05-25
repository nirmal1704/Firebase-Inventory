import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { isFirebaseConfigured } from './firebase/config'

function SetupScreen() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <span className="mb-4 inline-block text-5xl float-gentle" aria-hidden>
        📦
      </span>
      <h1 className="font-display text-3xl font-bold text-ink">Almost ready!</h1>
      <p className="mt-4 text-ink-soft">
        Copy <code className="rounded bg-butter px-1.5 py-0.5 font-mono text-sm">.env.example</code>{' '}
        to <code className="rounded bg-butter px-1.5 py-0.5 font-mono text-sm">.env</code> in the
        project root, then paste your Firebase web app config. Open{' '}
        <strong className="text-ink">README.md</strong> for the full walkthrough.
      </p>
    </div>
  )
}

export default function App() {
  if (!isFirebaseConfigured) {
    return <SetupScreen />
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
