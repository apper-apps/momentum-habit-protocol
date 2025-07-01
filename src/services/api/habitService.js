import habitsData from '@/services/mockData/habits.json'
import checkInsData from '@/services/mockData/checkIns.json'
import { format, isToday } from 'date-fns'

class HabitService {
  constructor() {
    this.habits = [...habitsData]
    this.checkIns = [...checkInsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.habits]
  }

  async getById(id) {
    await this.delay()
    return this.habits.find(habit => habit.Id === parseInt(id))
  }

  async create(habitData) {
    await this.delay()
    const newHabit = {
      ...habitData,
      Id: Math.max(...this.habits.map(h => h.Id), 0) + 1,
      createdAt: new Date().toISOString(),
    }
    this.habits.push(newHabit)
    return { ...newHabit }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.habits.findIndex(habit => habit.Id === parseInt(id))
    if (index === -1) throw new Error('Habit not found')
    
    this.habits[index] = { ...this.habits[index], ...updates }
    return { ...this.habits[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.habits.findIndex(habit => habit.Id === parseInt(id))
    if (index === -1) throw new Error('Habit not found')
    
    this.habits.splice(index, 1)
    // Also remove related check-ins
    this.checkIns = this.checkIns.filter(checkIn => checkIn.habitId !== parseInt(id))
    return true
  }

  async getAllCheckIns() {
    await this.delay()
    return [...this.checkIns]
  }

  async getCheckInsByHabit(habitId) {
    await this.delay()
    return this.checkIns.filter(checkIn => checkIn.habitId === parseInt(habitId))
  }

  async getTodaysCheckIns() {
    await this.delay()
    return this.checkIns.filter(checkIn => isToday(new Date(checkIn.date)))
  }

  async createCheckIn(checkInData) {
    await this.delay()
    const newCheckIn = {
      ...checkInData,
      Id: Math.max(...this.checkIns.map(c => c.Id), 0) + 1,
      date: new Date().toISOString(),
    }
    this.checkIns.push(newCheckIn)
    return { ...newCheckIn }
  }

  async updateCheckIn(id, updates) {
    await this.delay()
    const index = this.checkIns.findIndex(checkIn => checkIn.Id === parseInt(id))
    if (index === -1) throw new Error('Check-in not found')
    
    this.checkIns[index] = { ...this.checkIns[index], ...updates }
    return { ...this.checkIns[index] }
  }

  async getHabitStreaks(habitId) {
    await this.delay()
    const checkIns = this.checkIns
      .filter(c => c.habitId === parseInt(habitId) && c.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calculate current streak
    const today = new Date()
    let checkDate = new Date(today)
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = format(checkDate, 'yyyy-MM-dd')
      const hasCheckIn = checkIns.some(c => 
        format(new Date(c.date), 'yyyy-MM-dd') === dateStr
      )
      
      if (hasCheckIn) {
        currentStreak++
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        if (i === 0) {
          // If no check-in today, look at yesterday
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
        break
      }
      
      checkDate.setDate(checkDate.getDate() - 1)
    }

    return {
      current: currentStreak,
      longest: longestStreak,
      total: checkIns.length
    }
  }

  async getHabitCategories() {
    await this.delay()
    const categories = [...new Set(this.habits.map(h => h.category))]
    return categories
  }
}

export default new HabitService()