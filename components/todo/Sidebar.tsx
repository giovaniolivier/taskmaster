"use client"

import React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PlusIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { NewTaskDialog } from './NewTaskDialog'
import { useTheme } from '@/components/theme/theme-provider'

type SidebarProps = {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

export function Sidebar({ selectedFilter, onFilterChange }: SidebarProps) {
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const filters = [
    { id: 'all', label: 'All Tasks', icon: '📋' },
    { id: 'completed', label: 'Completed', icon: '✓' },
  ]

  const categories = [
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'shopping', label: 'Shopping', icon: '🛒' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'other', label: 'Other', icon: '📌' },
  ]

  const priorities = [
    { id: 'high', label: 'High Priority', icon: '🔴' },
    { id: 'medium', label: 'Medium Priority', icon: '🟡' },
    { id: 'low', label: 'Low Priority', icon: '🔵' },
  ]

  return (
    <>
      <div className="w-60 bg-white dark:bg-zinc-900 h-screen p-4 flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-300 flex items-center justify-center text-white font-bold text-lg">
              TM
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">TaskMaster</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Button 
          variant="secondary" 
          className="gap-2 justify-start"
          onClick={() => setIsNewTaskDialogOpen(true)}
        >
          <PlusIcon className="h-4 w-4" /> New Task
        </Button>

        <div>
          <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Status
          </h2>
          <nav className="space-y-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedFilter === filter.id
                    ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                )}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Categories
          </h2>
          <nav className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedFilter === category.id
                    ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                )}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            Priority
          </h2>
          <nav className="space-y-1">
            {priorities.map((priority) => (
              <button
                key={priority.id}
                onClick={() => onFilterChange(priority.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedFilter === priority.id
                    ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                )}
              >
                <span>{priority.icon}</span>
                <span>{priority.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <NewTaskDialog 
        open={isNewTaskDialogOpen} 
        onOpenChange={setIsNewTaskDialogOpen} 
      />
    </>
  )
} 