"use client"

import { useState } from 'react'
import { useTodo, type Priority, type Category } from './todo-context'
import { TaskCard } from './TaskCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { type SortOption } from '@/app/page'

type TodoListProps = {
  viewMode: 'grid' | 'list'
  selectedFilter: string
  searchQuery: string
  sortBy: SortOption
}

export function TodoList({ viewMode, selectedFilter, searchQuery, sortBy }: TodoListProps) {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    updateTodoPriority,
    updateTodoCategory,
    updateTodoDeadline,
  } = useTodo()

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<{
    id: string
    text: string
    priority: Priority
    category: Category
    deadline?: Date
  } | null>(null)

  const handleEditTodo = (todo: typeof editingTodo) => {
    if (!todo) return
    editTodo(todo.id, todo.text)
    updateTodoPriority(todo.id, todo.priority)
    updateTodoCategory(todo.id, todo.category)
    if (todo.deadline) {
      updateTodoDeadline(todo.id, todo.deadline)
    }
    setIsEditDialogOpen(false)
    setEditingTodo(null)
  }

  // Fonction pour obtenir la valeur numérique de la priorité pour le tri
  const getPriorityValue = (priority: Priority) => {
    switch (priority) {
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 0
    }
  }

  const filteredAndSortedTodos = todos
    // Filtrage
    .filter(todo => {
      const matchesFilter = (() => {
        switch (selectedFilter) {
          case 'all':
            return true
          case 'completed':
            return todo.completed
          case 'work':
          case 'personal':
          case 'shopping':
          case 'team':
          case 'other':
            return todo.category === selectedFilter
          case 'high':
          case 'medium':
          case 'low':
            return todo.priority === selectedFilter
          default:
            return true
        }
      })()

      const matchesSearch = searchQuery
        ? todo.text.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      return matchesFilter && matchesSearch
    })
    // Tri
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          return getPriorityValue(b.priority) - getPriorityValue(a.priority)
        default:
          return 0
      }
    })

  return (
    <>
      {filteredAndSortedTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-zinc-400">
          <p className="text-lg mb-2">No tasks found</p>
          <p className="text-sm">
            {searchQuery 
              ? "Try adjusting your search term"
              : "Try selecting a different filter or add some tasks"}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          <AnimatePresence>
            {filteredAndSortedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  todo={todo}
                  isSelected={selectedTodoId === todo.id}
                  onClick={() => {
                    setSelectedTodoId(todo.id)
                    setEditingTodo(todo)
                    setIsEditDialogOpen(true)
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  value={editingTodo.text}
                  onChange={(e) => setEditingTodo({ ...editingTodo, text: e.target.value })}
                  className="bg-background border-input"
                />
              </div>

              <div className="flex gap-4">
                <Select
                  value={editingTodo.priority}
                  onValueChange={(value: Priority) => setEditingTodo({ ...editingTodo, priority: value })}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🔵 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🔴 High</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={editingTodo.category}
                  onValueChange={(value: Category) => setEditingTodo({ ...editingTodo, category: value })}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">💼 Work</SelectItem>
                    <SelectItem value="personal">👤 Personal</SelectItem>
                    <SelectItem value="shopping">🛒 Shopping</SelectItem>
                    <SelectItem value="team">👥 Team</SelectItem>
                    <SelectItem value="other">📌 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full bg-background border-input">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingTodo.deadline ? (
                      format(editingTodo.deadline, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editingTodo.deadline}
                    onSelect={(date) => setEditingTodo({ ...editingTodo, deadline: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleEditTodo(editingTodo)}
                >
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 