import { AuthProvider } from '@/components/auth-provider'
import { AuthModal } from '@/components/auth-modal'
import { SorcererProvider } from '@/components/sorcerer-provider'
import { AppShell } from '@/components/app-shell'

export default function Page() {
  return (
    <AuthProvider>
      <SorcererProvider>
        <AppShell />
        <AuthModal />
      </SorcererProvider>
    </AuthProvider>
  )
}

