import { useState } from 'react'
import { Plus, Minus, Clock } from 'lucide-react'
import { Input } from '../ui/Input'

interface Lesson {
  startTime: string
  endTime: string
}

interface DayScheduleProps {
  date: string
  lessons: Lesson[]
  onUpdate: (lessons: Lesson[]) => void
  onRemove: () => void
  showRemove?: boolean
}

export function DaySchedule({ date, lessons, onUpdate, onRemove, showRemove = true }: DayScheduleProps) {
  const addLesson = () => {
    onUpdate([...lessons, { startTime: '', endTime: '' }])
  }

  const removeLesson = (index: number) => {
    const newLessons = lessons.filter((_, i) => i !== index)
    onUpdate(newLessons)
  }

  const updateLesson = (index: number, field: keyof Lesson, value: string) => {
    const newLessons = lessons.map((lesson, i) => {
      if (i === index) {
        return { ...lesson, [field]: value }
      }
      return lesson
    })
    onUpdate(newLessons)
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">
          {new Date(date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </h4>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600"
          >
            <Minus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <Input
                type="time"
                value={lesson.startTime}
                onChange={(e) => updateLesson(index, 'startTime', e.target.value)}
                className="flex-1"
              />
              <span className="text-gray-500">à</span>
              <Input
                type="time"
                value={lesson.endTime}
                onChange={(e) => updateLesson(index, 'endTime', e.target.value)}
                className="flex-1"
              />
            </div>
            {lessons.length > 1 && (
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="text-red-500 hover:text-red-600"
              >
                <Minus className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addLesson}
          className="flex items-center space-x-2 text-primary hover:text-primary-dark"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter une leçon</span>
        </button>
      </div>
    </div>
  )
}