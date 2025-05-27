"use client"

import { useState } from 'react'
import { Todo } from './todo-context'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'

interface TaskListProps {
  tasks: Todo[]
  selectedTaskId?: string
  onTaskSelect?: (taskId: string) => void
}

export function TaskList({ tasks, selectedTaskId, onTaskSelect }: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const resetFilters = () => {
    setStatusFilter('all')
    setCategoryFilter('all')
    setPriorityFilter('all')
  }

  const filteredTasks = tasks.filter(todo => {
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'completed' 
        ? todo.completed 
        : !todo.completed

    const matchesCategory = categoryFilter === 'all' 
      ? true 
      : todo.category === categoryFilter

    const matchesPriority = priorityFilter === 'all'
      ? true
      : todo.priority === priorityFilter

    return matchesStatus && matchesCategory && matchesPriority
  })

  return (
    <div className="space-y-4">
      <TaskFilters
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onPriorityChange={setPriorityFilter}
        onReset={resetFilters}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No tasks match your filters
          </div>
        ) : (
          filteredTasks.map((todo) => (
            <TaskCard
              key={todo.id}
              todo={todo}
              isSelected={selectedTaskId === todo.id}
              onClick={() => onTaskSelect?.(todo.id)}
            />
          ))
        )}
      </div>
    </div>
  )
} 