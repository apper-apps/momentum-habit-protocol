import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  habits: [],
  checkIns: [],
  loading: false,
  error: null,
}

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setHabits: (state, action) => {
      state.habits = action.payload
    },
    addHabit: (state, action) => {
      state.habits.push(action.payload)
    },
    updateHabit: (state, action) => {
      const index = state.habits.findIndex(habit => habit.Id === action.payload.Id)
      if (index !== -1) {
        state.habits[index] = action.payload
      }
    },
    deleteHabit: (state, action) => {
      state.habits = state.habits.filter(habit => habit.Id !== action.payload)
      state.checkIns = state.checkIns.filter(checkIn => checkIn.habitId !== action.payload)
    },
    setCheckIns: (state, action) => {
      state.checkIns = action.payload
    },
    addCheckIn: (state, action) => {
      state.checkIns.push(action.payload)
    },
    updateCheckIn: (state, action) => {
      const index = state.checkIns.findIndex(checkIn => checkIn.Id === action.payload.Id)
      if (index !== -1) {
        state.checkIns[index] = action.payload
      }
    },
  },
})

export const {
  setLoading,
  setError,
  setHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  setCheckIns,
  addCheckIn,
  updateCheckIn,
} = habitSlice.actions

export default habitSlice.reducer