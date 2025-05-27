"use client"

import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Todo, useTodo } from './todo-context'
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon } from '@radix-ui/react-icons'
import { TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

type TaskCardProps = {
  todo: Todo
  isSelected?: boolean
  onClick?: () => void
}

export function TaskCard({ todo, isSelected, onClick }: TaskCardProps) {
  const { toggleTodo, deleteTodo } = useTodo()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTodo(todo.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTodo(todo.id)
  }

  return (
    <Card
      className={cn(
        "p-4 transition-all cursor-pointer",
        "bg-white dark:bg-zinc-800",
        "shadow-lg hover:shadow-xl dark:shadow-zinc-900/50 dark:hover:shadow-zinc-900/70",
        "border-0",
        isSelected && "bg-orange-50 dark:bg-orange-500/10",
        todo.completed && "opacity-60"
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(todo.createdAt), 'MMMM dd, yyyy h:mm a')}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={handleDelete}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <button
              onClick={handleToggle}
              className={cn(
                "w-5 h-5 rounded border transition-colors flex items-center justify-center",
                todo.completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              )}
            >
              {todo.completed && (
                <CheckIcon className="h-3 w-3 text-white" />
              )}
            </button>
          </div>
        </div>

        <h3 className={cn(
          "text-sm font-medium",
          "text-gray-900 dark:text-white",
          todo.completed && "line-through text-gray-500 dark:text-gray-400"
        )}>
          {todo.text}
        </h3>

        <div className="flex gap-2">
          {todo.category === 'team' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
              Team
            </span>
          )}
          {todo.priority === 'high' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">
              Important
            </span>
          )}
          {todo.deadline && (
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              new Date(todo.deadline) < new Date()
                ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
            )}>
              {format(new Date(todo.deadline), 'PPP')}
            </span>
          )}
          {todo.completed && todo.deadline && new Date(todo.deadline) < new Date() && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300">
              Expired
            </span>
          )}
        </div>

        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden">
            <div className="w-full h-full bg-gray-300 dark:bg-zinc-600" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden">
            <div className="w-full h-full bg-gray-300 dark:bg-zinc-600" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden">
            <div className="w-full h-full bg-gray-300 dark:bg-zinc-600" />
          </div>
        </div>
      </div>
    </Card>
  )
} 