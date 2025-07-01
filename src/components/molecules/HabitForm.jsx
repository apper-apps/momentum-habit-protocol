import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const HabitForm = ({ habit = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    category: habit?.category || 'Personal Development',
    frequency: habit?.frequency || 'daily',
    target: habit?.target || 1,
    difficulty: habit?.difficulty || 1,
    color: habit?.color || '#8B5CF6',
    icon: habit?.icon || 'Target',
  })
  
  const [errors, setErrors] = useState({})
  
  const categories = [
    'Personal Development',
    'Health',
    'Fitness',
    'Wellness',
    'Productivity',
    'Learning',
    'Creativity',
    'Social',
    'Finance',
    'Other'
  ]
  
  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' },
  ]
  
  const difficulties = [
    { value: 1, label: 'Easy', color: 'text-green-600' },
    { value: 2, label: 'Medium', color: 'text-yellow-600' },
    { value: 3, label: 'Hard', color: 'text-red-600' },
  ]
  
  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#8B5A2B', '#EC4899', '#6B7280'
  ]
  
  const icons = [
    'Target', 'Heart', 'Dumbbell', 'BookOpen', 'Brain',
    'Droplets', 'Sun', 'Moon', 'Coffee', 'Apple',
    'Bike', 'Music', 'Paintbrush', 'Camera', 'Pen'
  ]
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required'
    }
    
    if (formData.target < 1) {
      newErrors.target = 'Target must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }
  
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Habit Name"
            placeholder="e.g., Morning Meditation"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            icon="Target"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Brief description of your habit..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="input-field resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="input-field"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
            className="input-field"
          >
            {frequencies.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Input
            label="Daily Target"
            type="number"
            min="1"
            placeholder="1"
            value={formData.target}
            onChange={(e) => handleInputChange('target', parseInt(e.target.value) || 1)}
            error={errors.target}
            icon="Hash"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
            className="input-field"
          >
            {difficulties.map(diff => (
              <option key={diff.value} value={diff.value}>
                {diff.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleInputChange('color', color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Icon
        </label>
        <div className="grid grid-cols-8 gap-2">
          {icons.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => handleInputChange('icon', icon)}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                formData.icon === icon 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={icon} size={20} className="text-gray-600" />
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          icon="Save"
        >
          {habit ? 'Update Habit' : 'Create Habit'}
        </Button>
      </div>
    </motion.form>
  )
}

export default HabitForm