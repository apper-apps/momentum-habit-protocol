import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'purple',
  gradient = false,
  className = '',
}) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
  }
  
  const iconColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
  }
  
  const backgroundColorClasses = {
    purple: 'bg-purple-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`card-premium p-6 ${gradient ? 'text-white' : ''} ${className}`}
      style={gradient ? {
        background: `linear-gradient(135deg, ${colorClasses[color]?.replace(' ', ', ')})`
      } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          gradient ? 'bg-white bg-opacity-20' : backgroundColorClasses[color]
        }`}>
          <ApperIcon 
            name={icon} 
            size={24} 
            className={gradient ? 'text-white' : iconColorClasses[color]}
          />
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 ${
            gradient ? 'text-white' : 
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            <ApperIcon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            {trendValue && (
              <span className="text-sm font-medium">{trendValue}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className={`text-3xl font-bold ${gradient ? 'text-white' : 'gradient-text'}`}>
          {value}
        </div>
        <div className={`text-sm ${gradient ? 'text-white text-opacity-80' : 'text-gray-600'}`}>
          {title}
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard