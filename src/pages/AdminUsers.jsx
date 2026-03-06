import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, deleteUser } from '../api/users'
import { getTasks } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const AdminUsers = () => {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [users,   setUsers]   = useState([])
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [deletingId, setDeletingId] = useState(null)

  // Redirect non-admins immediately
  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/dashboard')
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const [userRes, taskRes] = await Promise.all([getAllUsers(), getTasks()])
      setUsers(userRes.data.users)
      setTasks(taskRes.data.tasks)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also delete all their tasks.`)) return
    setDeletingId(id)
    try {
      await deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
      setTasks(tasks.filter(t => t.userId !== id))
    } catch (e) {
      alert('Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  const pending   = tasks.filter(t => t.status === 'pending').length
  const completed = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/40 text-sm mt-1">Manage users and monitor all tasks</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Users',  value: users.length,  color: 'text-indigo-400' },
            { label: 'Total Tasks',  value: tasks.length,  color: 'text-white' },
            { label: 'Pending',      value: pending,       color: 'text-amber-400' },
            { label: 'Completed',    value: completed,     color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/50 text-xs">{s.label}</p>
              <p className={`font-display text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['users', 'tasks'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab === 'users' ? `Users (${users.length})` : `All Tasks (${tasks.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/30 py-20">Loading...</div>
        ) : activeTab === 'users' ? (

          /* ── USERS TABLE ── */
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">User</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Email</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Role</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Tasks</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Joined</th>
                    <th className="text-right text-xs text-white/40 uppercase tracking-widest px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white/80 text-sm font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/50 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/50'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/50 text-sm">
                        {tasks.filter(t => t.userId === u.id).length} tasks
                      </td>
                      <td className="px-6 py-4 text-white/40 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id === user.id ? (
                          <span className="text-xs text-white/20">You</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={deletingId === u.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"
                          >
                            {deletingId === u.id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/10">
              {users.map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">{u.name}</p>
                      <p className="text-white/40 text-xs">{u.email}</p>
                      <p className="text-white/30 text-xs">{tasks.filter(t => t.userId === u.id).length} tasks</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/50'}`}>
                      {u.role}
                    </span>
                    {u.id !== user.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        disabled={deletingId === u.id}
                        className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        {deletingId === u.id ? '...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (

          /* ── ALL TASKS TABLE ── */
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Task</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Owner</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Status</th>
                    <th className="text-left text-xs text-white/40 uppercase tracking-widest px-6 py-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t, i) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white/80 text-sm font-medium">{t.title}</p>
                        {t.description && <p className="text-white/30 text-xs mt-0.5 truncate max-w-xs">{t.description}</p>}
                      </td>
                      <td className="px-6 py-4 text-white/50 text-sm">{t.user?.name || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          t.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-sm">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile task cards */}
            <div className="md:hidden divide-y divide-white/10">
              {tasks.map(t => (
                <div key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{t.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">by {t.user?.name}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                      t.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers