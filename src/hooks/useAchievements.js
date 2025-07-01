import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import achievementService from '@/services/api/achievementService'
import { setLoading, setError, setAchievements } from '@/store/slices/achievementSlice'

export const useAchievements = () => {
  const dispatch = useDispatch()
  const { achievements, loading, error } = useSelector(state => state.achievements)

  const loadAchievements = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await achievementService.getAll()
      dispatch(setAchievements(data))
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getUnlockedAchievements = () => {
    return achievements.filter(achievement => achievement.unlockedAt !== null)
  }

  const getLockedAchievements = () => {
    return achievements.filter(achievement => achievement.unlockedAt === null)
  }

  const getTotalPoints = () => {
    return achievements
      .filter(a => a.unlockedAt !== null)
      .reduce((total, achievement) => total + achievement.points, 0)
  }

  const getProgressByCategory = () => {
    const categories = [...new Set(achievements.map(a => a.category))]
    const progress = {}

    categories.forEach(category => {
      const categoryAchievements = achievements.filter(a => a.category === category)
      const unlockedCount = categoryAchievements.filter(a => a.unlockedAt !== null).length
      progress[category] = {
        unlocked: unlockedCount,
        total: categoryAchievements.length,
        percentage: Math.round((unlockedCount / categoryAchievements.length) * 100)
      }
    })

    return progress
  }

  const getRecentAchievements = (limit = 5) => {
    return achievements
      .filter(a => a.unlockedAt !== null)
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, limit)
  }

  useEffect(() => {
    loadAchievements()
  }, [])

  return {
    achievements,
    loading,
    error,
    getUnlockedAchievements,
    getLockedAchievements,
    getTotalPoints,
    getProgressByCategory,
    getRecentAchievements,
    loadAchievements,
  }
}