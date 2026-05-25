import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

export function LoginForm() {
  const { login, register, loginWithGoogle, error, setError } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, displayName)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setBusy(true)
    setError(null)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="cartoon-border mx-auto max-w-md rounded-2xl bg-lavender/50 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold text-ink">
        {mode === 'login' ? 'Welcome back!' : 'Create your nook'}
      </h2>
      <p className="mt-1 font-hand text-2xl text-ink-soft">
        {mode === 'login'
          ? 'Sign in to peek at your shelves'
          : 'A free account keeps your stash private'}
      </p>

      {error && (
        <p className="mt-4 rounded-xl border-2 border-ink bg-coral/90 px-3 py-2 text-sm text-white" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === 'register' && (
          <Input
            label="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Optional"
          />
        )}
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="mint" className="w-full" disabled={busy}>
          {busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-ink/20" />
        <span className="font-hand text-xl text-ink-soft">or</span>
        <span className="h-0.5 flex-1 bg-ink/20" />
      </div>

      <Button variant="butter" className="w-full" onClick={handleGoogle} disabled={busy}>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {mode === 'login' ? "New here?" : 'Already have an account?'}{' '}
        <button
          type="button"
          className="font-display font-bold text-ink underline decoration-coral decoration-2 underline-offset-2 hover:text-coral"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError(null)
          }}
        >
          {mode === 'login' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </div>
  )
}
