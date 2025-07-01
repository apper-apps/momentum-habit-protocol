import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAchievements } from '@/hooks/useAchievements'
import { useUserStats } from '@/hooks/useUserStats'
import AchievementCard from '@/components/molecules/AchievementCard'
import StatCard from '@/components/molecules/StatCard'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const AchievementGallery = () => {
  const { achievements, loading, error, getTotalPoints, getProgressByCategory } = useAchievements()
  const { stats } = useUserStats()
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('unlocked')
  
  const unlockedAchievements = achievements.filter(a => a.unlockedAt !== null)
  const lockedAchievements = achievements.filter(a => a.unlockedAt === null)
  const totalPoints = getTotalPoints()
  const categoryProgress = getProgressByCategory()
  
  const categories = ['all', 'milestone', 'streak', 'creation', 'category', 'time', 'completion', 'management']
  
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true
    if (filter === 'unlocked') return achievement.unlockedAt !== null
    if (filter === 'locked') return achievement.unlockedAt === null
    return achievement.category === filter
  })
  
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'unlocked':
        return (b.unlockedAt !== null ? 1 : 0) - (a.unlockedAt !== null ? 1 : 0)
      case 'points':
        return b.points - a.points
      case 'date':
        if (!a.unlockedAt && !b.unlockedAt) return 0
        if (!a.unlockedAt) return 1
        if (!b.unlockedAt) return -1
        return new Date(b.unlockedAt) - new Date(a.unlockedAt)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
  
  if (loading) return <Loading type="stats" />
  if (error) return <Error message={error} type="achievements" />
  if (achievements.length === 0) {
    return <Empty type="achievements" />
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements</h1>
          <p className="text-gray-600">Celebrate your progress and milestones</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            <option value="all">All Achievements</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            <option value="unlocked">Status</option>
            <option value="points">Points</option>
            <option value="date">Date Unlocked</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Points"
          value={totalPoints}
          icon="Award"
          color="amber"
          gradient
        />
        
        <StatCard
          title="Unlocked"
          value={unlockedAchievements.length}
          icon="Unlock"
          color="green"
        />
        
        <StatCard
          title="Remaining"
          value={lockedAchievements.length}
          icon="Lock"
          color="gray"
        />
        
        <StatCard
          title="Progress"
          value={`${Math.round((unlockedAchievements.length / achievements.length) * 100)}%`}
          icon="TrendingUp"
          color="purple"
        />
      </div>
      
      {/* Category Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryProgress).map(([category, progress]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {progress.unlocked}/{progress.total}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {progress.percentage}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Achievement Grid */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="primary" size="lg" icon="Award">
            {filteredAchievements.length} achievements
          </Badge>
          
          <Badge 
            variant={unlockedAchievements.length > 0 ? 'success' : 'default'} 
            size="lg" 
            icon="CheckCircle"
          >
            {unlockedAchievements.length} unlocked
          </Badge>
          
          <Badge variant="warning" size="lg" icon="Clock">
            {lockedAchievements.length} to unlock
          </Badge>
        </div>
        
        {/* Achievement Cards */}
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementCard
                  achievement={achievement}
                  isUnlocked={achievement.unlockedAt !== null}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600 mb-4">
              No achievements match your current filter criteria.
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
      
      {/* Motivational Section */}
      {lockedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 text-center bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <div className="max-w-md mx-auto">
            <ApperIcon name="Target" size={48} className="text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keep Going!
            </h3>
            <p className="text-gray-600 mb-4">
              You have {lockedAchievements.length} more achievements waiting to be unlocked. 
              Stay consistent with your habits to earn them all!
            </p>
            <div className="flex justify-center space-x-2">
              <Badge variant="primary" icon="Trophy">
                Next: {lockedAchievements[0]?.name}
              </Badge>
              <Badge variant="accent" icon="Plus">
                +{lockedAchievements[0]?.points} XP
              </Badge>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AchievementGallery