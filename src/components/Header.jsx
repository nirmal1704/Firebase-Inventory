import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/Button'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="cartoon-border relative z-10 rounded-2xl bg-butter/80 px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span
            className="float-gentle flex h-12 w-12 items-center justify-center rounded-xl bg-mint cartoon-border-sm text-2xl"
            aria-hidden
          >
            📦
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Stash<span className="text-coral">Box</span>
            </h1>
            <p className="font-hand text-xl text-ink-soft leading-none">
              your friendly inventory nook
            </p>
          </div>
        </Link>

        {isAuthenticated && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-body text-sm text-ink-soft">
              Hey,{' '}
              <span className="font-display font-semibold text-ink">
                {user?.displayName || user?.email?.split('@')[0] || 'friend'}
              </span>
              !
            </p>
            <Button variant="cream" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
