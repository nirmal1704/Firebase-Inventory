import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/Header'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  const { isAuthenticated, loading } = useAuth()

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Header />
      <section className="mt-10">
        <LoginForm />
      </section>
    </div>
  )
}
