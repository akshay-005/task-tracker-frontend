import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-display font-bold text-xl text-white tracking-tight">
          Task<span className="text-indigo-400">Tracker</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm text-white/50">
            {user?.name}
            <span className="text-indigo-400 text-xs uppercase tracking-widest ml-1">{user?.role}</span>
          </span>
          <Link to="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/tasks"     className="text-sm text-white/70 hover:text-white transition-colors">Tasks</Link>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/60 px-4 py-4 flex flex-col gap-4">
          <span className="text-sm text-white/50">{user?.name} — <span className="text-indigo-400">{user?.role}</span></span>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white">Dashboard</Link>
          <Link to="/tasks"     onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white">Tasks</Link>
          <button onClick={handleLogout} className="text-left text-sm text-red-400 hover:text-red-300">Logout</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar