import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks     from './pages/Tasks'

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/"          element={<Navigate to="/dashboard" replace />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks"     element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
    </Routes>
  </AuthProvider>
)

export default App