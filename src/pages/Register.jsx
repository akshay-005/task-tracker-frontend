import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

// ✅ Moved OUTSIDE Register — prevents re-render focus loss
const Field = ({ name, label, type = 'text', placeholder, value, onChange, error }) => (
  <div>
    <label className="block text-sm text-white/60 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${
        error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500'
      }`}
    />
    {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
  </div>
)

const Register = () => {
  const [form, setForm]         = useState({ name: '', email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name || form.name.length < 2)              newErrors.name     = 'Name must be at least 2 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email    = 'Valid email required'
    if (!form.password || form.password.length < 6)      newErrors.password = 'Password must be at least 6 characters'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors)

    setLoading(true)
    try {
      const res = await register(form)
      loginUser(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-white">Create account</h1>
          <p className="text-white/50 mt-2 text-sm">Join Task Tracker today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5 backdrop-blur-sm">
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">{apiError}</div>
          )}

          <Field name="name"     label="Full Name" placeholder="Akshay Dev"        value={form.name}     onChange={handleChange} error={errors.name} />
          <Field name="email"    label="Email"     placeholder="you@example.com"   value={form.email}    onChange={handleChange} error={errors.email} type="email" />
          <Field name="password" label="Password"  placeholder="••••••••"          value={form.password} onChange={handleChange} error={errors.password} type="password" />

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all glow-btn mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register