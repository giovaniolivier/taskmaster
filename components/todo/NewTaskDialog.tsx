"use client"

import { useState } from 'react'
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
import { useTodo, type Priority, type Category } from './todo-context'

type NewTaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTaskDialog({ open, onOpenChange }: NewTaskDialogProps) {
  const { addTodo } = useTodo()
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [category, setCategory] = useState<Category>('other')
  const [deadline, setDeadline] = useState<Date>()

  const handleSubmit = () => {
    if (text.trim()) {
      addTodo(text, priority, category, deadline)
      setText('')
      setPriority('medium')
      setCategory('other')
      setDeadline(undefined)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Task description..."
              className="bg-background border-input"
            />
          </div>

          <div className="flex gap-4">
            <Select
              value={priority}
              onValueChange={(value: Priority) => setPriority(value)}
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
              value={category}
              onValueChange={(value: Category) => setCategory(value)}
            >
              <SelectTrigger className="w-full bg-background border-input">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">💼 Work</SelectItem>
                <SelectItem value="personal">👤 Personal</SelectItem>
                <SelectItem value="shopping">🛒 Shopping</SelectItem>
                <SelectItem value="other">📌 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full bg-background border-input">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? (
                  format(deadline, 'PPP')
                ) : (
                  <span>Choose deadline</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 