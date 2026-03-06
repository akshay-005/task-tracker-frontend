const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const isPending = task.status === 'pending'

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/40 hover:bg-white/8 transition-all duration-300 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => onToggle(task)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
              isPending ? 'border-white/30 hover:border-indigo-400' : 'border-indigo-500 bg-indigo-500'
            }`}
          >
            {!isPending && <span className="flex items-center justify-center text-white text-xs">✓</span>}
          </button>
          <div className="min-w-0">
            <h3 className={`font-display font-semibold text-base truncate ${!isPending ? 'line-through text-white/40' : 'text-white'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-white/50 mt-1 line-clamp-2">{task.description}</p>
            )}
            {task.user && (
              <p className="text-xs text-indigo-400/70 mt-2">by {task.user.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            isPending ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
          }`}>
            {task.status}
          </span>
          <button onClick={() => onEdit(task)} className="text-white/30 hover:text-indigo-400 transition-colors text-sm px-2">✎</button>
          <button onClick={() => onDelete(task.id)} className="text-white/30 hover:text-red-400 transition-colors text-sm px-2">✕</button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard