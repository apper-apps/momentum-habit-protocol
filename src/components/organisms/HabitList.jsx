import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HabitCard from '@/components/molecules/HabitCard'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const HabitList = ({ 
  habits = [], 
  checkIns = [], 
  onCreateHabit, 
  onEditHabit, 
  onDeleteHabit 
}) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  
  const categories = ['all', ...new Set(habits.map(h => h.category))]
  
  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true
    return habit.category === filter
  })
  
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'difficulty':
        return b.difficulty - a.difficulty
      case 'created':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })
  
  if (habits.length === 0) {
    return (
      <Empty
        type="habits"
        onAction={onCreateHabit}
        actionText="Create Your First Habit"
      />
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header with filters and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <p className="text-gray-600">Track and manage your daily habits</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            <option value="created">Date Created</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="difficulty">Difficulty</option>
          </select>
          
          <Button
            onClick={onCreateHabit}
            icon="Plus"
            size="sm"
          >
            Add Habit
          </Button>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{habits.length}</div>
          <div className="text-sm text-gray-600">Total Habits</div>
        </div>
        
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {categories.length - 1}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {Math.round(habits.reduce((sum, h) => sum + h.difficulty, 0) / habits.length) || 0}
          </div>
          <div className="text-sm text-gray-600">Avg Difficulty</div>
        </div>
        
        <div className="card-premium p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {checkIns.filter(c => c.completed).length}
          </div>
          <div className="text-sm text-gray-600">Completions</div>
        </div>
      </div>
      
      {/* Habit Cards */}
      <AnimatePresence>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedHabits.map((habit, index) => (
            <motion.div
              key={habit.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <HabitCard
                habit={habit}
                checkIns={checkIns}
                onEdit={() => onEditHabit(habit)}
                onDelete={() => onDeleteHabit(habit.Id)}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      
      {filteredHabits.length === 0 && habits.length > 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Filter" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits found</h3>
          <p className="text-gray-600 mb-4">
            No habits match your current filter criteria.
          </p>
          <Button
            onClick={() => setFilter('all')}
            variant="outline"
            size="sm"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default HabitList