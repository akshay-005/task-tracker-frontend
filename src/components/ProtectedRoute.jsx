import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps any page that requires login
// If not logged in → redirect to /login automatically
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-indigo-400">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute