import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, startOfDay } from 'date-fns'
import { useHabits } from '@/hooks/useHabits'
import { useUserStats } from '@/hooks/useUserStats'
import StatCard from '@/components/molecules/StatCard'
import Button from '@/components/atoms/Button'
import ProgressRing from '@/components/atoms/ProgressRing'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TodayDashboard = ({ onCreateHabit, onViewHabits }) => {
  const { habits, checkIns, loading, error, completeHabit } = useHabits()
  const { stats, getExperienceProgress } = useUserStats()
  const [completingHabits, setCompletingHabits] = useState(new Set())
  
  // Get today's progress
  const today = startOfDay(new Date())
  const todayCheckIns = checkIns.filter(checkIn => 
    isToday(new Date(checkIn.date))
  )
  
  const completedHabits = todayCheckIns.filter(c => c.completed)
  const totalHabits = habits.length
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabits.length / totalHabits) * 100) : 0
  
  // Get experience progress
  const xpProgress = getExperienceProgress()
  
  // Handle habit completion
  const handleCompleteHabit = async (habitId) => {
    try {
      setCompletingHabits(prev => new Set(prev).add(habitId))
      
      // Check if already completed today
      const existingCheckIn = todayCheckIns.find(c => c.habitId === habitId)
      const isCompleted = existingCheckIn?.completed || false
      
      await completeHabit(habitId, !isCompleted)
    } catch (error) {
      console.error('Failed to complete habit:', error)
    } finally {
      setCompletingHabits(prev => {
        const newSet = new Set(prev)
        newSet.delete(habitId)
        return newSet
      })
    }
  }
  
  if (loading) return <Loading type="habits" />
  if (error) return <Error message={error} onRetry={() => window.location.reload()} />
  if (habits.length === 0) {
    return <Empty type="habits" onAction={onCreateHabit} />
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold gradient-text mb-2"
        >
          Good {format(new Date(), 'a') === 'AM' ? 'Morning' : 'Evening'}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg"
        >
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </motion.p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Level"
          value={stats.level}
          icon="Crown"
          color="purple"
          gradient
        />
        
        <StatCard
          title="Current Streak"
          value={Math.max(...Object.values(stats.currentStreaks || {}), 0)}
          icon="Flame"
          color="amber"
        />
        
        <StatCard
          title="Total Days"
          value={stats.totalDaysTracked}
          icon="Calendar"
          color="blue"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate * 100)}%`}
          icon="Target"
          color="green"
        />
      </div>
      
      {/* Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium p-8 text-center"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Progress</h3>
          
          <ProgressRing
            progress={completionPercentage}
            size={160}
            strokeWidth={12}
            color="#8B5CF6"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {completedHabits.length}
              </div>
              <div className="text-sm text-gray-600">
                of {totalHabits} habits
              </div>
            </div>
          </ProgressRing>
          
          <div className="mt-6 flex justify-center">
            <Badge
              variant={completionPercentage === 100 ? 'success' : 'primary'}
              size="lg"
              icon={completionPercentage === 100 ? 'CheckCircle' : 'Clock'}
            >
              {completionPercentage === 100 ? 'Perfect Day!' : `${completionPercentage}% Complete`}
            </Badge>
          </div>
        </motion.div>
        
        {/* Experience Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Level Progress</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Crown" className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Level {stats.level}</span>
              </div>
              <span className="text-sm text-gray-600">
                {xpProgress.current}/{xpProgress.needed} XP
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
              />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">
                {stats.experience}
              </div>
              <div className="text-sm text-gray-600">Total Experience</div>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-premium p-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="space-y-4">
            <Button
              onClick={onCreateHabit}
              variant="primary"
              size="lg"
              icon="Plus"
              className="w-full"
            >
              Add New Habit
            </Button>
            
            <Button
              onClick={onViewHabits}
              variant="outline"
              size="lg"
              icon="List"
              className="w-full"
            >
              View All Habits
            </Button>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 mb-2">Next Level</div>
              <div className="text-lg font-semibold text-gray-900">
                {xpProgress.needed - xpProgress.current} XP needed
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Today's Habits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-premium p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Today's Habits</h3>
          <Badge variant="primary" size="sm">
            {completedHabits.length}/{totalHabits} completed
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit, index) => {
            const isCompleted = todayCheckIns.some(c => c.habitId === habit.Id && c.completed)
            const isCompleting = completingHabits.has(habit.Id)
            
            return (
              <motion.div
                key={habit.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: habit.color + '20' }}
                    >
                      <ApperIcon 
                        name={habit.icon || 'Target'} 
                        size={20} 
                        style={{ color: habit.color }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{habit.name}</h4>
                      <p className="text-sm text-gray-600">{habit.category}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleCompleteHabit(habit.Id)}
                    loading={isCompleting}
                    variant={isCompleted ? 'success' : 'outline'}
                    size="sm"
                    icon={isCompleted ? 'Check' : 'Plus'}
                  >
                    {isCompleted ? 'Done' : 'Mark'}
                  </Button>
                </div>
                
                {habit.target > 1 && (
                  <div className="text-sm text-gray-600">
                    Target: {habit.target} times
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default TodayDashboard