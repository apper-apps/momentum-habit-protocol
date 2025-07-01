import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import Chart from 'react-apexcharts'
import { useHabits } from '@/hooks/useHabits'
import { useUserStats } from '@/hooks/useUserStats'
import StatCard from '@/components/molecules/StatCard'
import ProgressCalendar from '@/components/molecules/ProgressCalendar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const AnalyticsDashboard = () => {
  const { habits, checkIns, loading, error } = useHabits()
  const { stats } = useUserStats()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedHabit, setSelectedHabit] = useState('all')
  
  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!checkIns.length) return null
    
    const completedCheckIns = checkIns.filter(c => c.completed)
    const totalCheckIns = checkIns.length
    
    // Success rate
    const successRate = totalCheckIns > 0 ? (completedCheckIns.length / totalCheckIns) * 100 : 0
    
    // Weekly progress
    const weekStart = startOfWeek(new Date())
    const weekEnd = endOfWeek(new Date())
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    const weeklyData = weekDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayCheckIns = completedCheckIns.filter(c => 
        format(new Date(c.date), 'yyyy-MM-dd') === dayStr
      )
      return {
        date: format(day, 'EEE'),
        completions: dayCheckIns.length
      }
    })
    
    // Category breakdown
    const categoryStats = {}
    habits.forEach(habit => {
      const habitCheckIns = completedCheckIns.filter(c => c.habitId === habit.Id)
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = {
          total: 0,
          completed: 0,
          habits: []
        }
      }
      categoryStats[habit.category].total += checkIns.filter(c => c.habitId === habit.Id).length
      categoryStats[habit.category].completed += habitCheckIns.length
      categoryStats[habit.category].habits.push(habit)
    })
    
    // Best performing habits
    const habitPerformance = habits.map(habit => {
      const habitCheckIns = checkIns.filter(c => c.habitId === habit.Id)
      const habitCompleted = habitCheckIns.filter(c => c.completed)
      const rate = habitCheckIns.length > 0 ? (habitCompleted.length / habitCheckIns.length) * 100 : 0
      
      return {
        habit,
        completions: habitCompleted.length,
        attempts: habitCheckIns.length,
        successRate: rate
      }
    }).sort((a, b) => b.successRate - a.successRate)
    
    return {
      successRate,
      weeklyData,
      categoryStats,
      habitPerformance,
      totalCompletions: completedCheckIns.length,
      totalAttempts: totalCheckIns,
      averageDaily: completedCheckIns.length / 7 // Assuming 7 days of data
    }
  }, [habits, checkIns])
  
  // Chart configurations
  const weeklyChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#8B5CF6'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%'
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: analyticsData?.weeklyData.map(d => d.date) || [],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: { text: 'Completions' }
    },
    grid: {
      show: true,
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    }
  }
  
  const weeklyChartSeries = [{
    name: 'Completions',
    data: analyticsData?.weeklyData.map(d => d.completions) || []
  }]
  
  const categoryChartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    labels: Object.keys(analyticsData?.categoryStats || {}),
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: 'bottom' }
      }
    }]
  }
  
  const categoryChartSeries = Object.values(analyticsData?.categoryStats || {}).map(stat => stat.completed)
  
  if (loading) return <Loading type="chart" />
  if (error) return <Error message={error} type="analytics" />
  if (!analyticsData || analyticsData.totalCompletions === 0) {
    return <Empty type="analytics" />
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your progress and discover insights</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <select
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            className="input-field text-sm py-2 pr-8"
          >
            <option value="all">All Habits</option>
            {habits.map(habit => (
              <option key={habit.Id} value={habit.Id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Success Rate"
          value={`${Math.round(analyticsData.successRate)}%`}
          icon="Target"
          color="green"
          trend={analyticsData.successRate > 75 ? 'up' : analyticsData.successRate > 50 ? 'stable' : 'down'}
        />
        
        <StatCard
          title="Total Completions"
          value={analyticsData.totalCompletions}
          icon="CheckCircle"
          color="purple"
          trend="up"
          trendValue="+12%"
        />
        
        <StatCard
          title="Daily Average"
          value={Math.round(analyticsData.averageDaily)}
          icon="Calendar"
          color="blue"
        />
        
        <StatCard
          title="Best Streak"
          value={Math.max(...Object.values(stats.longestStreaks || {}), 0)}
          icon="Flame"
          color="amber"
          gradient
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <Chart
            options={weeklyChartOptions}
            series={weeklyChartSeries}
            type="bar"
            height={300}
          />
        </motion.div>
        
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <Chart
            options={categoryChartOptions}
            series={categoryChartSeries}
            type="donut"
            height={300}
          />
        </motion.div>
      </div>
      
      {/* Habit Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Habit Performance</h3>
        
        <div className="space-y-4">
          {analyticsData.habitPerformance.slice(0, 5).map((item, index) => (
            <div key={item.habit.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.habit.color + '20' }}
                >
                  <ApperIcon 
                    name={item.habit.icon || 'Target'} 
                    size={20} 
                    style={{ color: item.habit.color }}
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">{item.habit.name}</h4>
                  <p className="text-sm text-gray-600">{item.habit.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.completions} completions
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.attempts} attempts
                  </div>
                </div>
                
                <Badge
                  variant={item.successRate >= 80 ? 'success' : item.successRate >= 60 ? 'warning' : 'danger'}
                  size="sm"
                >
                  {Math.round(item.successRate)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Progress Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ProgressCalendar checkIns={checkIns} />
      </motion.div>
    </div>
  )
}

export default AnalyticsDashboard