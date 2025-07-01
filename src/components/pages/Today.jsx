import { useState } from 'react'
import { motion } from 'framer-motion'
import TodayDashboard from '@/components/organisms/TodayDashboard'
import HabitForm from '@/components/molecules/HabitForm'
import { useHabits } from '@/hooks/useHabits'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Today = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const { createHabit } = useHabits()
  const navigate = useNavigate()
  
  const handleCreateHabit = async (habitData) => {
    try {
      setIsCreating(true)
      await createHabit(habitData)
      setShowCreateForm(false)
      toast.success('Habit created successfully!')
    } catch (error) {
      toast.error('Failed to create habit')
    } finally {
      setIsCreating(false)
    }
  }
  
  const handleViewHabits = () => {
    navigate('/habits')
  }
  
  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Habit</h1>
            <p className="text-gray-600">Add a new habit to your daily routine</p>
          </div>
          
          <div className="card-premium p-8">
            <HabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setShowCreateForm(false)}
              loading={isCreating}
            />
          </div>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <TodayDashboard
        onCreateHabit={() => setShowCreateForm(true)}
        onViewHabits={handleViewHabits}
      />
    </div>
  )
}

export default Today