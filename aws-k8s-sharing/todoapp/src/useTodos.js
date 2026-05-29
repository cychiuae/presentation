import { useEffect, useState } from 'react'

const STORAGE_KEY = 'todoapp.todos'

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Persists the todo list to localStorage and exposes CRUD helpers.
export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (text) => {
    const title = text.trim()
    if (!title) return
    setTodos((prev) => [
      { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() },
      ...prev,
    ])
  }

  const editTodo = (id, text) => {
    const title = text.trim()
    if (!title) return
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title } : t)),
    )
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return { todos, addTodo, editTodo, toggleTodo, deleteTodo }
}
