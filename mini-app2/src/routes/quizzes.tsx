import { createFileRoute } from '@tanstack/react-router'
import { QuizzesPage } from '../components/QuizzesPage'

export const Route = createFileRoute('/quizzes')({
  component: QuizzesPage,
})