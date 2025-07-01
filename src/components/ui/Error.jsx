import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message, onRetry, type = 'general' }) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'habits':
        return {
          icon: 'Target',
          title: 'Unable to Load Habits',
          description: 'We had trouble loading your habits. Please try again.',
        }
      case 'analytics':
        return {
          icon: 'BarChart3',
          title: 'Analytics Unavailable',
          description: 'Unable to generate your progress analytics right now.',
        }
      case 'sync':
        return {
          icon: 'RefreshCw',
          title: 'Sync Failed',
          description: 'Your data couldn\'t sync. Check your connection and try again.',
        }
      default:
        return {
          icon: 'AlertCircle',
          title: 'Something Went Wrong',
          description: 'An unexpected error occurred. Please try again.',
        }
    }
  }

  const config = getErrorConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name={config.icon} size={32} className="text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
          <p className="text-gray-600 max-w-sm">
            {message || config.description}
          </p>
        </div>

        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="btn-primary flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Error