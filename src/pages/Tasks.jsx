import { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'

const emptyForm = { title: '', description: '', status: 'pending' }

const Tasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(emptyForm)
  const [errors, setErrors]     = useState({})
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [apiError, setApiError] = useState('')
  const [filter, setFilter]     = useState('all')

  const fetchTasks = async () => {
    try {
      const res = await getTasks()
      setTasks(res.data.tasks)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTasks() }, [])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    try {
      if (editingId) {
        await updateTask(editingId, form)
      } else {
        await createTask(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      fetchTasks()
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong.')
    }
  }

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description || '', status: task.status })
    setEditingId(task.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    await deleteTask(id)
    fetchTasks()
  }

  const handleToggle = async (task) => {
    await updateTask(task.id, { status: task.status === 'pending' ? 'completed' : 'pending' })
    fetchTasks()
  }

  const filtered = tasks.filter(t => filter === 'all' ? true : t.status === filter)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Tasks</h1>
            <p className="text-white/40 text-sm mt-1">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null) }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all glow-btn"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-4 animate-fade-up">
            <h2 className="font-display font-semibold text-white">{editingId ? 'Edit Task' : 'New Task'}</h2>
            {apiError && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">{apiError}</p>}

            <div>
              <input
                value={form.title} onChange={e => { setForm({...form, title: e.target.value}); setErrors({...errors, title: ''}) }}
                placeholder="Task title *"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-all ${errors.title ? 'border-red-500/50' : 'border-white/10 focus:border-indigo-500'}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <textarea
              value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Description (optional)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />

            <select
              value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
              {editingId ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-up-delay">
          {['all', 'pending', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-sm px-4 py-2 rounded-lg capitalize transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center text-white/30 py-20">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/20 text-lg">No {filter !== 'all' ? filter : ''} tasks found</p>
            <p className="text-white/10 text-sm mt-2">Click "+ New Task" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(task => (
              <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tasks