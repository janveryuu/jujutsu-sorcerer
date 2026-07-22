import { SorcererProvider } from '@/components/sorcerer-provider'
import { AppShell } from '@/components/app-shell'

export default function Page() {
  return (
    <SorcererProvider>
      <AppShell />
    </SorcererProvider>
  )
}
