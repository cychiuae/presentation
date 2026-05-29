import { useState } from 'react'
import { useTodos } from './useTodos'
import TodoItem from './TodoItem'

export default function App() {
  const { todos, addTodo, editTodo, toggleTodo, deleteTodo } = useTodos()
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    addTodo(input)
    setInput('')
  }

  const remaining = todos.filter((t) => !t.done).length

  return (
    <main className="app">
      <h1>Today</h1>

      <form className="add-form" onSubmit={handleSubmit}>
        <input
          className="add-input"
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-add">
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="empty">No todos yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onEdit={editTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <footer className="summary">
          {remaining} of {todos.length} remaining
        </footer>
      )}
    </main>
  )
}
