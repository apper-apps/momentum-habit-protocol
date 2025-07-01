import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stats: {
    level: 1,
    experience: 0,
    totalDaysTracked: 0,
    currentStreaks: {},
    longestStreaks: {},
  },
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload }
    },
    addExperience: (state, action) => {
      state.stats.experience += action.payload
      // Level up logic
      const newLevel = Math.floor(state.stats.experience / 100) + 1
      if (newLevel > state.stats.level) {
        state.stats.level = newLevel
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setStats,
  updateStats,
  addExperience,
} = userSlice.actions

export default userSlice.reducer