import { createFileRoute } from '@tanstack/react-router'
import { TonWalletConnection } from '../components/TonWalletConnection'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <TonWalletConnection />
}
