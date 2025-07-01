import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const AchievementCard = ({ achievement, isUnlocked = false }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'milestone': return 'purple'
      case 'streak': return 'amber'
      case 'creation': return 'blue'
      case 'category': return 'green'
      case 'time': return 'orange'
      case 'completion': return 'indigo'
      case 'management': return 'pink'
      default: return 'gray'
    }
  }
  
  const categoryColor = getCategoryColor(achievement.category)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      className={`card-premium p-6 transition-all duration-200 ${
        isUnlocked ? 'hover:shadow-card-hover' : 'opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
          isUnlocked 
            ? `bg-gradient-to-br from-${categoryColor}-500 to-${categoryColor}-600` 
            : 'bg-gray-200'
        }`}>
          <ApperIcon 
            name={achievement.icon} 
            size={32} 
            className={isUnlocked ? 'text-white' : 'text-gray-400'}
          />
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <Badge 
            variant={isUnlocked ? 'success' : 'default'} 
            size="sm"
            icon={isUnlocked ? 'Check' : 'Lock'}
          >
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </Badge>
          
          <div className={`text-sm font-medium ${
            isUnlocked ? 'text-amber-600' : 'text-gray-400'
          }`}>
            +{achievement.points} XP
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className={`text-lg font-semibold ${
          isUnlocked ? 'text-gray-900' : 'text-gray-500'
        }`}>
          {achievement.name}
        </h3>
        
        <p className={`text-sm ${
          isUnlocked ? 'text-gray-600' : 'text-gray-400'
        }`}>
          {achievement.description}
        </p>
        
        {isUnlocked && achievement.unlockedAt && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-3">
            <ApperIcon name="Calendar" size={12} />
            <span>Unlocked {format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AchievementCard