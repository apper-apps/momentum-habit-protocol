import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ProgressRing from '@/components/atoms/ProgressRing'
import { useHabits } from '@/hooks/useHabits'
import { format, isToday } from 'date-fns'

const HabitCard = ({ habit, checkIns = [], onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const { completeHabit, getHabitStreaks } = useHabits()
  
  // Check if habit is completed today
  const todayCheckIn = checkIns.find(checkIn => 
    checkIn.habitId === habit.Id && isToday(new Date(checkIn.date))
  )
  const isCompletedToday = todayCheckIn?.completed || false
  
  // Calculate progress for habits with targets > 1
  const todayProgress = habit.target > 1 ? (isCompletedToday ? habit.target : 0) : 0
  const progressPercentage = habit.target > 1 ? (todayProgress / habit.target) * 100 : 0
  
  // Get current streak
  const [streaks, setStreaks] = useState({ current: 0, longest: 0, total: 0 })
  
  useState(() => {
    getHabitStreaks(habit.Id).then(setStreaks)
  }, [habit.Id])
  
  const handleComplete = async () => {
    try {
      setIsCompleting(true)
      await completeHabit(habit.Id, !isCompletedToday)
      
      // Update streaks
      const newStreaks = await getHabitStreaks(habit.Id)
      setStreaks(newStreaks)
    } catch (error) {
      console.error('Failed to complete habit:', error)
    } finally {
      setIsCompleting(false)
    }
  }
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'success'
      case 2: return 'warning'
      case 3: return 'danger'
      default: return 'primary'
    }
  }
  
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Easy'
      case 2: return 'Medium'
      case 3: return 'Hard'
      default: return 'Unknown'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6 hover:shadow-card-hover transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <ApperIcon 
              name={habit.icon || 'Target'} 
              size={24} 
              style={{ color: habit.color }}
            />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            <p className="text-sm text-gray-600">{habit.category}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getDifficultyColor(habit.difficulty)} size="sm">
            {getDifficultyText(habit.difficulty)}
          </Badge>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {habit.description && (
        <p className="text-gray-600 text-sm mb-4">{habit.description}</p>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Flame" className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900">{streaks.current}</span>
            </div>
            <div className="text-xs text-gray-500">Current</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Trophy" className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-900">{streaks.longest}</span>
            </div>
            <div className="text-xs text-gray-500">Best</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Target" className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">{streaks.total}</span>
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
        
        {habit.target > 1 && (
          <ProgressRing
            progress={progressPercentage}
            size={60}
            strokeWidth={4}
            color={habit.color}
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-xs font-medium text-gray-900">
                {todayProgress}/{habit.target}
              </div>
            </div>
          </ProgressRing>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
          {habit.target > 1 && ` • ${habit.target} times`}
        </div>
        
        <Button
          onClick={handleComplete}
          loading={isCompleting}
          variant={isCompletedToday ? 'success' : 'primary'}
          size="sm"
          icon={isCompletedToday ? 'Check' : 'Plus'}
        >
          {isCompletedToday ? 'Completed' : 'Mark Done'}
        </Button>
      </div>
    </motion.div>
  )
}

export default HabitCard