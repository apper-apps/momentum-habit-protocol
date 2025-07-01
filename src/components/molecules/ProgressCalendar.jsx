import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'

const ProgressCalendar = ({ checkIns = [], selectedMonth = new Date() }) => {
  const monthStart = startOfMonth(selectedMonth)
  const monthEnd = endOfMonth(selectedMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const getCompletionLevel = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayCheckIns = checkIns.filter(checkIn => 
      format(new Date(checkIn.date), 'yyyy-MM-dd') === dateStr && checkIn.completed
    )
    
    if (dayCheckIns.length === 0) return 0
    
    // Calculate completion percentage based on number of habits completed
    const totalHabits = 5 // This should be dynamic based on habits count
    const completedHabits = dayCheckIns.length
    
    return Math.min((completedHabits / totalHabits) * 100, 100)
  }
  
  const getIntensityColor = (level) => {
    if (level === 0) return 'bg-gray-100'
    if (level <= 25) return 'bg-green-200'
    if (level <= 50) return 'bg-green-300'
    if (level <= 75) return 'bg-green-400'
    return 'bg-green-500'
  }
  
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {format(selectedMonth, 'MMMM yyyy')}
        </h3>
        <p className="text-sm text-gray-600">
          Track your daily habit completions
        </p>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map(day => {
          const completionLevel = getCompletionLevel(day)
          const intensityColor = getIntensityColor(completionLevel)
          const isCurrentMonth = isSameMonth(day, selectedMonth)
          const isCurrentDay = isToday(day)
          
          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.random() * 0.1 }}
              className={`
                aspect-square flex items-center justify-center text-xs font-medium rounded-md
                ${intensityColor}
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isCurrentDay ? 'ring-2 ring-purple-500' : ''}
                hover:scale-110 transition-transform cursor-pointer
              `}
              title={`${format(day, 'MMM d')} - ${Math.round(completionLevel)}% complete`}
            >
              {format(day, 'd')}
            </motion.div>
          )
        })}
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600">
          Completion intensity
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">Less</span>
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProgressCalendar