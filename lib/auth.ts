import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  provider: 'google' | 'email'
  emailVerified: boolean
  createdAt: string
}

export interface AuthSession {
  user: AuthUser | null
  token: string | null
  expiresAt?: string
}

export interface StoredUser extends AuthUser {
  passwordHash?: string // Hashed password: "salt:hash"
}

// Password hashing helper using Node.js native crypto (PBKDF2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedHash?: string): boolean {
  if (!storedHash) return false
  
  // Legacy / demo plain password fallback
  if (!storedHash.includes(':')) {
    return password === storedHash
  }

  const [salt, originalHash] = storedHash.split(':')
  if (!salt || !originalHash) return false

  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
}

// File persistence configuration
const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function loadUsersFromDisk(): Map<string, StoredUser> {
  const usersMap = new Map<string, StoredUser>()
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        parsed.forEach((user: StoredUser) => {
          if (user.email) {
            usersMap.set(user.email.toLowerCase().trim(), user)
          }
        })
      }
    }
  } catch (err) {
    console.error('[SORCERER Auth] Failed to load users from disk:', err)
  }
  return usersMap
}

function saveUsersToDisk(usersMap: Map<string, StoredUser>): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const arr = Array.from(usersMap.values())
    fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), 'utf-8')
  } catch (err) {
    console.error('[SORCERER Auth] Failed to save users to disk:', err)
  }
}

// Global scope user store to persist across API reloads in development server
const globalAuth = globalThis as unknown as {
  __sorcerer_users?: Map<string, StoredUser>
  __sorcerer_sessions?: Map<string, AuthUser>
}

if (!globalAuth.__sorcerer_users) {
  globalAuth.__sorcerer_users = loadUsersFromDisk()
  
  // Ensure default demo user exists
  if (!globalAuth.__sorcerer_users.has('sorcerer@jujutsu.ac')) {
    const demoUser: StoredUser = {
      id: 'user_demo_01',
      email: 'sorcerer@jujutsu.ac',
      name: 'Satoru Gojo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'email',
      emailVerified: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword('sorcerer123'),
    }
    globalAuth.__sorcerer_users.set(demoUser.email, demoUser)
    saveUsersToDisk(globalAuth.__sorcerer_users)
  }
}

if (!globalAuth.__sorcerer_sessions) {
  globalAuth.__sorcerer_sessions = new Map<string, AuthUser>()
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sorcerer-key-v1'

function createToken(user: AuthUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64url')
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function verifyToken(token: string): AuthUser | null {
  try {
    const [payload, signature] = token.split('.')
    if (!payload || !signature) return null
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('base64url')
    
    // Use timingSafeEqual to prevent timing attacks
    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSig)
    if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
    }
  } catch (err) {
    console.error('[Auth] Token verify error:', err)
  }
  return null
}

export const userStore = {
  findByEmail(email: string): StoredUser | undefined {
    return globalAuth.__sorcerer_users?.get(email.toLowerCase().trim())
  },

  create(userData: {
    email: string
    name: string
    passwordHash?: string
    provider: 'google' | 'email'
    avatar?: string
  }): AuthUser {
    const emailKey = userData.email.toLowerCase().trim()
    
    // Deterministic ID based on email so Vercel doesn't create infinite users
    const idHash = crypto.createHash('sha256').update(emailKey).digest('hex').substring(0, 16)
    const id = `user_${idHash}`
    
    const newUser: StoredUser = {
      id,
      email: emailKey,
      name: userData.name || emailKey.split('@')[0],
      avatar: userData.avatar,
      provider: userData.provider,
      emailVerified: userData.provider === 'google',
      createdAt: new Date().toISOString(),
      passwordHash: userData.passwordHash,
    }

    globalAuth.__sorcerer_users?.set(newUser.email, newUser)
    if (globalAuth.__sorcerer_users) {
      saveUsersToDisk(globalAuth.__sorcerer_users)
    }

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      provider: newUser.provider,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
    }
  },

  createSession(user: AuthUser): string {
    return createToken(user)
  },

  getSession(token: string): AuthUser | null {
    return verifyToken(token)
  },

  deleteSession(token: string): void {
    // Stateless tokens cannot be individually deleted server-side without a blacklist,
    // but the cookie will be deleted by the client, which is sufficient here.
  },
}

