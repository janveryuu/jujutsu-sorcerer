'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useAuth } from './auth-provider'
import { SorcererButton } from './sorcerer-ui'
import { cn } from '@/lib/utils'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithEmail, signupWithEmail, loginWithGoogle } =
    useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signin') {
        const res = await loginWithEmail(email, password)
        if (!res.success) {
          setError(res.error || 'Failed to sign in.')
        }
      } else {
        const res = await signupWithEmail(email, password, name)
        if (!res.success) {
          setError(res.error || 'Failed to create account.')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError(null)
    setLoading(true)
    try {
      // If real Google Client ID is configured in env, redirect to official Google OAuth consent page
      if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        window.location.href = '/api/auth/google'
        return
      }

      // Fallback: Perform instant demo Google sign-in
      const res = await loginWithGoogle()
      if (!res.success) {
        setError(res.error || 'Failed to authenticate with Google.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoConnect = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await loginWithEmail('sorcerer@jujutsu.ac', 'sorcerer123')
      if (!res.success) {
        // Fallback to google demo if email demo fails
        await loginWithGoogle('gojo.satoru@jujutsu.ac', 'Satoru Gojo')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        >
          {/* Ambient Cursed Energy Glow */}
          <div className="absolute -left-12 -top-12 size-40 rounded-full bg-ce/20 blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 size-40 rounded-full bg-jade/15 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-1.5 mb-6">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-ce/10 text-ce ring-1 ring-ce/30 mb-2">
              <Zap className="size-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {mode === 'signin' ? 'Awaken Your Account' : 'Register Sorcerer'}
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign in with Google or your Email to sync your cursed energy.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-surface-2 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError(null)
              }}
              className={cn(
                'rounded-lg py-2 text-xs font-semibold transition-all',
                mode === 'signin'
                  ? 'bg-surface text-foreground shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError(null)
              }}
              className={cn(
                'rounded-lg py-2 text-xs font-semibold transition-all',
                mode === 'signup'
                  ? 'bg-surface text-foreground shadow-sm ring-1 ring-border'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2.5 rounded-xl border border-crimson/30 bg-crimson/10 p-3 text-xs text-crimson"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          ) : null}

          {/* Google Sign-In Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2/80 px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-surface-2 hover:border-ce/50 focus:outline-none focus:ring-2 focus:ring-ce/50 disabled:opacity-50 mb-4"
          >
            {/* Google SVG Icon */}
            <svg className="size-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Or with Email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' ? (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Sorcerer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Satoru Gojo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface-2/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ce focus:outline-none focus:ring-1 focus:ring-ce"
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="sorcerer@jujutsu.ac"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ce focus:outline-none focus:ring-1 focus:ring-ce"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2/50 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-ce focus:outline-none focus:ring-1 focus:ring-ce"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <SorcererButton
              type="submit"
              disabled={loading}
              className="mt-2 w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  Processing...
                </span>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Sorcerer Account'
              )}
            </SorcererButton>
          </form>

          {/* Demo Login shortcut */}
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <button
              type="button"
              onClick={handleDemoConnect}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-ce hover:underline font-medium"
            >
              <Sparkles className="size-3.5" />
              Quick Demo Connect (1-Click Login)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
