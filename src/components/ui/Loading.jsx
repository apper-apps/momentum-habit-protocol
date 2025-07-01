import { motion } from 'framer-motion'

const Loading = ({ type = 'habits' }) => {
  const renderHabitsLoading = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full shimmer" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32 shimmer" />
                <div className="h-3 bg-gray-200 rounded w-24 shimmer" />
              </div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded-full shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderStatsLoading = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="card-premium p-6"
        >
          <div className="space-y-3">
            <div className="w-8 h-8 bg-gray-200 rounded shimmer" />
            <div className="h-8 bg-gray-200 rounded w-16 shimmer" />
            <div className="h-3 bg-gray-200 rounded w-20 shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderChartLoading = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-premium p-6"
    >
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-40 shimmer" />
        <div className="h-64 bg-gray-200 rounded shimmer" />
      </div>
    </motion.div>
  )

  const renderType = () => {
    switch (type) {
      case 'habits':
        return renderHabitsLoading()
      case 'stats':
        return renderStatsLoading()
      case 'chart':
        return renderChartLoading()
      default:
        return renderHabitsLoading()
    }
  }

  return (
    <div className="animate-pulse">
      {renderType()}
    </div>
  )
}

export default Loading