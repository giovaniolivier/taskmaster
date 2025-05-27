"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Priority = 'low' | 'medium' | 'high'
export type Category = 'work' | 'personal' | 'shopping' | 'other' | 'team'

export type Todo = {
  id: string
  text: string
  completed: boolean
  createdAt: string
  priority: Priority
  category: Category
  deadline?: Date
}

type TodoContextType = {
  todos: Todo[]
  addTodo: (text: string, priority: Priority, category: Category, deadline?: Date) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, text: string) => void
  updateTodoPriority: (id: string, priority: Priority) => void
  updateTodoCategory: (id: string, category: Category) => void
  updateTodoDeadline: (id: string, deadline?: Date) => void
}

const TodoContext = createContext<TodoContextType | undefined>(undefined)

const serializeTodos = (todos: Todo[]): string => {
  return JSON.stringify(todos, (key, value) => {
    if (key === 'deadline' && value) {
      return new Date(value).toISOString()
    }
    return value
  })
}

const deserializeTodos = (todosString: string): Todo[] => {
  return JSON.parse(todosString, (key, value) => {
    if (key === 'deadline' && value) {
      return new Date(value)
    }
    return value
  })
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTodos = localStorage.getItem('todos')
        if (savedTodos) {
          return deserializeTodos(savedTodos)
        }
      } catch (error) {
        console.error('Error loading initial todos:', error)
      }
    }
    return []
  })

  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem('todos')) {
      try {
        console.log('Saving todos:', todos)
        const serializedTodos = serializeTodos(todos)
        console.log('Serialized todos:', serializedTodos)
        localStorage.setItem('todos', serializedTodos)
        console.log('Todos saved successfully')
      } catch (error) {
        console.error('Error saving todos:', error)
      }
    }
  }, [todos])

  useEffect(() => {
    const checkExpiredTasks = () => {
      const now = new Date()
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todo.deadline && !todo.completed) {
            const deadline = new Date(todo.deadline)
            if (deadline < now) {
              return { ...todo, completed: true }
            }
          }
          return todo
        })
      )
    }

    checkExpiredTasks()
    const interval = setInterval(checkExpiredTasks, 60000)
    return () => clearInterval(interval)
  }, [])

  const addTodo = (text: string, priority: Priority, category: Category, deadline?: Date) => {
    setTodos(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        priority,
        category,
        deadline,
      }
    ])
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, text: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text } : todo
      )
    )
  }

  const updateTodoPriority = (id: string, priority: Priority) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    )
  }

  const updateTodoCategory = (id: string, category: Category) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, category } : todo
      )
    )
  }

  const updateTodoDeadline = (id: string, deadline?: Date) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, deadline } : todo
      )
    )
  }

  return (
    <TodoContext.Provider value={{
      todos,
      addTodo,
      toggleTodo,
      deleteTodo,
      editTodo,
      updateTodoPriority,
      updateTodoCategory,
      updateTodoDeadline,
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}