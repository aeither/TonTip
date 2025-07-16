import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/reward-contract')({
  component: RewardContractPage,
})

function RewardContractPage() {
  return (
    <div className="min-h-screen bg-[#282c34] text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="bg-[#3a3f47] rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Reward Contract</h1>
          <p className="text-gray-300">
            This page will be implemented next. It will interact with the reward contract.
          </p>
        </div>
      </div>
    </div>
  )
}