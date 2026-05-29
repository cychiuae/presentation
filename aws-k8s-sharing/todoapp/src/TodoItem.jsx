import { useState } from 'react'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)

  const save = () => {
    onEdit(todo.id, draft)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(todo.title)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') cancel()
  }

  return (
    <li className={`todo-item ${todo.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        className="todo-check"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />

      {editing ? (
        <input
          className="edit-input"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          autoFocus
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => setEditing(true)}
        >
          {todo.title}
        </span>
      )}

      <div className="todo-actions">
        {editing ? (
          <>
            <button className="btn" onClick={save}>
              Save
            </button>
            <button className="btn" onClick={cancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(todo.id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  )
}
