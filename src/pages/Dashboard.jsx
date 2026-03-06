import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTasks } from '../api/tasks'
import { getAllUsers } from '../api/users'
import Navbar from '../components/Navbar'

const StatCard = ({ label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-up">
    <p className="text-white/50 text-sm">{label}</p>
    <p className={`font-display text-4xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()
  const [tasks, setTasks]   = useState([])
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await getTasks()
        setTasks(taskRes.data.tasks)
        if (user?.role === 'admin') {
          const userRes = await getAllUsers()
          setUsers(userRes.data.users)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const pending   = tasks.filter(t => t.status === 'pending').length
  const completed = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-white">
            Hey, {user?.name} 👋
          </h1>
          <p className="text-white/40 mt-1">Here's your overview</p>
        </div>

        {loading ? (
          <div className="text-white/40 text-center py-20">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
              <StatCard label="Total Tasks"     value={tasks.length} color="text-white" />
              <StatCard label="Pending"         value={pending}      color="text-amber-400" />
              <StatCard label="Completed"       value={completed}    color="text-emerald-400" />
              {user?.role === 'admin' && <StatCard label="Total Users" value={users.length} color="text-indigo-400" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Recent Tasks */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-white">Recent Tasks</h2>
                  <Link to="/tasks" className="text-indigo-400 text-sm hover:text-indigo-300">View all →</Link>
                </div>
                {tasks.length === 0 ? (
                  <p className="text-white/30 text-sm text-center py-8">No tasks yet. <Link to="/tasks" className="text-indigo-400">Create one</Link></p>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <span className="text-sm text-white/70 truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin: All Users */}
              {user?.role === 'admin' && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="font-display font-semibold text-white mb-4">All Users</h2>
                  <div className="space-y-3">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white/80">{u.name}</p>
                          <p className="text-xs text-white/30">{u.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-white/50'}`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard