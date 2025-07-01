import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  achievements: [],
  loading: false,
  error: null,
}

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setAchievements: (state, action) => {
      state.achievements = action.payload
    },
    unlockAchievement: (state, action) => {
      const achievement = state.achievements.find(a => a.Id === action.payload.Id)
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setAchievements,
  unlockAchievement,
} = achievementSlice.actions

export default achievementSlice.reducer