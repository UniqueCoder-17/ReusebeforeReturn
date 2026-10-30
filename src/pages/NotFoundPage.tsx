import { useNavigate } from 'react-router-dom'
import { Home, Search, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <Leaf className="h-16 w-16 text-green-300 mb-6" />
      <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Button onClick={() => navigate('/')}><Home className="h-4 w-4 mr-2" /> Go Home</Button>
        <Button variant="outline" onClick={() => navigate('/explore')}><Search className="h-4 w-4 mr-2" /> Browse Items</Button>
      </div>
    </div>
  )
}
