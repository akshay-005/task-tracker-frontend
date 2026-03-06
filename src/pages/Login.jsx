import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!form.email || !form.password) return setError('All fields are required.')
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError('Enter a valid email.')

    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5 backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all glow-btn mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          No account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login