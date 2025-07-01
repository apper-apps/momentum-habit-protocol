import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import habitService from '@/services/api/habitService'
import userService from '@/services/api/userService'
import achievementService from '@/services/api/achievementService'
import {
  setLoading,
  setError,
  setHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  setCheckIns,
  addCheckIn,
  updateCheckIn,
} from '@/store/slices/habitSlice'
import { addExperience, updateStats } from '@/store/slices/userSlice'
import { unlockAchievement } from '@/store/slices/achievementSlice'

export const useHabits = () => {
  const dispatch = useDispatch()
  const { habits, checkIns, loading, error } = useSelector(state => state.habits)
  const { stats } = useSelector(state => state.user)

  const loadHabits = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await habitService.getAll()
      dispatch(setHabits(data))
    } catch (err) {
      dispatch(setError(err.message))
      toast.error('Failed to load habits')
    } finally {
      dispatch(setLoading(false))
    }
  }

  const loadCheckIns = async () => {
    try {
      const data = await habitService.getAllCheckIns()
      dispatch(setCheckIns(data))
    } catch (err) {
      console.error('Failed to load check-ins:', err)
    }
  }

  const createHabit = async (habitData) => {
    try {
      const newHabit = await habitService.create(habitData)
      dispatch(addHabit(newHabit))
      dispatch(addExperience(10))
      toast.success('Habit created successfully!')
      
      // Check for achievements
      await checkNewAchievements()
      return newHabit
    } catch (err) {
      toast.error('Failed to create habit')
      throw err
    }
  }

  const updateHabitData = async (id, updates) => {
    try {
      const updatedHabit = await habitService.update(id, updates)
      dispatch(updateHabit(updatedHabit))
      toast.success('Habit updated successfully!')
      return updatedHabit
    } catch (err) {
      toast.error('Failed to update habit')
      throw err
    }
  }

  const deleteHabitData = async (id) => {
    try {
      await habitService.delete(id)
      dispatch(deleteHabit(id))
      toast.success('Habit deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete habit')
      throw err
    }
  }

  const completeHabit = async (habitId, completed = true, notes = '', mood = 5) => {
    try {
      const checkInData = {
        habitId: parseInt(habitId),
        completed,
        notes,
        mood,
      }
      
      const newCheckIn = await habitService.createCheckIn(checkInData)
      dispatch(addCheckIn(newCheckIn))
      
      if (completed) {
        // Add experience points
        dispatch(addExperience(5))
        
        // Update streaks
        const streaks = await habitService.getHabitStreaks(habitId)
        await userService.updateStreak(habitId, streaks.current)
        
        // Update user stats
        const updatedStats = await userService.incrementDaysTracked()
        dispatch(updateStats(updatedStats))
        
        toast.success('Habit completed! +5 XP', {
          position: 'top-right',
          autoClose: 2000,
        })
        
        // Check for achievements
        await checkNewAchievements()
      }
      
      return newCheckIn
    } catch (err) {
      toast.error('Failed to update habit')
      throw err
    }
  }

  const checkNewAchievements = async () => {
    try {
      const newAchievements = await achievementService.checkAchievements(
        stats,
        habits,
        checkIns
      )
      
      newAchievements.forEach(achievement => {
        dispatch(unlockAchievement(achievement))
        dispatch(addExperience(achievement.points))
        toast.success(`🏆 Achievement unlocked: ${achievement.name}!`, {
          position: 'top-right',
          autoClose: 4000,
        })
      })
    } catch (err) {
      console.error('Failed to check achievements:', err)
    }
  }

  const getHabitStreaks = async (habitId) => {
    try {
      return await habitService.getHabitStreaks(habitId)
    } catch (err) {
      console.error('Failed to get habit streaks:', err)
      return { current: 0, longest: 0, total: 0 }
    }
  }

  const getTodaysProgress = () => {
    const today = new Date().toDateString()
    const todayCheckIns = checkIns.filter(checkIn => 
      new Date(checkIn.date).toDateString() === today
    )
    
    const completedHabits = todayCheckIns.filter(c => c.completed).length
    const totalHabits = habits.length
    
    return {
      completed: completedHabits,
      total: totalHabits,
      percentage: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0
    }
  }

  useEffect(() => {
    loadHabits()
    loadCheckIns()
  }, [])

  return {
    habits,
    checkIns,
    loading,
    error,
    createHabit,
    updateHabitData,
    deleteHabitData,
    completeHabit,
    getHabitStreaks,
    getTodaysProgress,
    loadHabits,
  }
}