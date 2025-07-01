import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userService from '@/services/api/userService'
import { setLoading, setError, setStats } from '@/store/slices/userSlice'

export const useUserStats = () => {
  const dispatch = useDispatch()
  const { stats, loading, error } = useSelector(state => state.user)

  const loadStats = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await userService.getStats()
      dispatch(setStats(data))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getExperienceProgress = () => {
    const currentLevelXP = (stats.level - 1) * 100
    const nextLevelXP = stats.level * 100
    const progress = stats.experience - currentLevelXP
    const needed = nextLevelXP - currentLevelXP
    
    return {
      current: progress,
      needed: needed,
      percentage: Math.round((progress / needed) * 100)
    }
  }

  const getTotalStreaks = () => {
    return Object.values(stats.currentStreaks || {}).reduce((sum, streak) => sum + streak, 0)
  }

  const getLongestCurrentStreak = () => {
    return Math.max(...Object.values(stats.currentStreaks || {}), 0)
  }

  const getAverageStreak = () => {
    const streaks = Object.values(stats.currentStreaks || {})
    if (streaks.length === 0) return 0
    return Math.round(streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length)
  }

  const getOverallProgress = () => {
    return {
      level: stats.level,
      experience: stats.experience,
      completionRate: stats.completionRate,
      totalDays: stats.totalDaysTracked,
      longestStreak: getLongestCurrentStreak(),
      averageStreak: getAverageStreak(),
      perfectDays: stats.perfectDays || 0,
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return {
    stats,
    loading,
    error,
    getExperienceProgress,
    getTotalStreaks,
    getLongestCurrentStreak,
    getAverageStreak,
    getOverallProgress,
    loadStats,
  }
}