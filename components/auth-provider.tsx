'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  loginWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  signupWithEmail: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: (
    customEmail?: string,
    customName?: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>(
    'loading',
  )
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Fetch session on load
  useEffect(() => {
    // If returning from a successful OAuth redirect, clear local storage to prevent old guest state hydration
    if (typeof window !== 'undefined' && window.location.search.includes('auth_success=1')) {
      try {
        localStorage.removeItem('sorcerer_state_v1')
        // Clean up URL without triggering a reload
        const url = new URL(window.location.href)
        url.searchParams.delete('auth_success')
        window.history.replaceState({}, document.title, url.toString())
      } catch (e) {
        console.error('Error clearing local storage on auth success', e)
      }
    }

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user)
          setStatus('authenticated')
        } else {
          setUser(null)
          setStatus('unauthenticated')
        }
      })
      .catch((err) => {
        console.error('Failed to load auth session:', err)
        setUser(null)
        setStatus('unauthenticated')
      })
  }, [])

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch('/api/auth/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sign-in', email, password }),
        })
        const data = await res.json()
        if (data.success && data.user) {
          setUser(data.user)
          setStatus('authenticated')
          setIsAuthModalOpen(false)
          window.location.reload()
          return { success: true }
        }
        return { success: false, error: data.error || 'Authentication failed' }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error' }
      }
    },
    [],
  )

  const signupWithEmail = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        const res = await fetch('/api/auth/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sign-up', email, password, name }),
        })
        const data = await res.json()
        if (data.success && data.user) {
          setUser(data.user)
          setStatus('authenticated')
          setIsAuthModalOpen(false)
          window.location.reload()
          return { success: true }
        }
        return { success: false, error: data.error || 'Signup failed' }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error' }
      }
    },
    [],
  )

  const loginWithGoogle = useCallback(
    async (customEmail?: string, customName?: string) => {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: customEmail, name: customName }),
        })
        const data = await res.json()
        if (data.success && data.user) {
          setUser(data.user)
          setStatus('authenticated')
          setIsAuthModalOpen(false)
          window.location.reload()
          return { success: true }
        }
        return { success: false, error: data.error || 'Google Authentication failed' }
      } catch (err: any) {
        return { success: false, error: err.message || 'Network error' }
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    setStatus('unauthenticated')
    window.location.reload()
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      loginWithEmail,
      signupWithEmail,
      loginWithGoogle,
      logout,
    }),
    [
      user,
      status,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      loginWithEmail,
      signupWithEmail,
      loginWithGoogle,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
