import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ type = 'habits', onAction, actionText = 'Get Started' }) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'habits':
        return {
          icon: 'Target',
          title: 'No Habits Yet',
          description: 'Start building positive habits today! Create your first habit to begin your journey.',
          actionText: 'Create Your First Habit',
          gradient: 'from-purple-500 to-purple-600',
        }
      case 'checkins':
        return {
          icon: 'Calendar',
          title: 'No Check-ins Today',
          description: 'Mark your habits as complete to start building your streaks and tracking progress.',
          actionText: 'View Today\'s Habits',
          gradient: 'from-green-500 to-green-600',
        }
      case 'achievements':
        return {
          icon: 'Award',
          title: 'No Achievements Yet',
          description: 'Keep completing your habits to unlock badges and celebrate your progress!',
          actionText: 'Track Your Habits',
          gradient: 'from-amber-500 to-amber-600',
        }
      case 'analytics':
        return {
          icon: 'BarChart3',
          title: 'Not Enough Data',
          description: 'Complete more habits to see your progress analytics and insights.',
          actionText: 'Complete Habits',
          gradient: 'from-blue-500 to-blue-600',
        }
      default:
        return {
          icon: 'Smile',
          title: 'Nothing Here',
          description: 'There\'s nothing to show right now. Start by creating some content.',
          actionText: actionText,
          gradient: 'from-purple-500 to-purple-600',
        }
    }
  }

  const config = getEmptyConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-6">
        <div className={`w-20 h-20 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center shadow-lg`}>
          <ApperIcon name={config.icon} size={40} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">
            {config.title}
          </h3>
          <p className="text-gray-600 max-w-md">
            {config.description}
          </p>
        </div>

        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className={`bg-gradient-to-r ${config.gradient} text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center space-x-2`}
          >
            <ApperIcon name="Plus" size={16} />
            <span>{config.actionText}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty