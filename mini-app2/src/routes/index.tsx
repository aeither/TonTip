import { createFileRoute } from '@tanstack/react-router'
import { DuolingoHomePage } from '../components/DuolingoHomePage'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return <DuolingoHomePage />
}
