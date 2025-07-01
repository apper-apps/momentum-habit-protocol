import userStatsData from '@/services/mockData/userStats.json'

class UserService {
  constructor() {
    // Deep clone with guaranteed mutability for all nested objects
    this.stats = this.deepClone(userStatsData)
  }

  // Utility method to create truly mutable deep copies
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime())
    if (obj instanceof Array) return obj.map(item => this.deepClone(item))
    
    // Create a new object with mutable properties
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key])
      }
    }
    return cloned
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getStats() {
    await this.delay()
    return { ...this.stats }
  }

  async updateStats(updates) {
    await this.delay()
    this.stats = { ...this.stats, ...updates }
    return { ...this.stats }
  }

  async addExperience(points) {
    await this.delay()
    this.stats.experience += points
    
    // Level up calculation
    const newLevel = Math.floor(this.stats.experience / 100) + 1
    if (newLevel > this.stats.level) {
      this.stats.level = newLevel
      return { levelUp: true, newLevel, ...this.stats }
    }
    
    return { ...this.stats }
  }

async updateStreak(habitId, newStreak) {
    await this.delay()
    
    try {
      // Ensure currentStreaks object exists and is mutable
      if (!this.stats.currentStreaks) {
        this.stats.currentStreaks = {}
      }
      
      // Safe property assignment using spread operator
      this.stats.currentStreaks = {
        ...this.stats.currentStreaks,
        [habitId]: newStreak
      }
      
      // Update longest streak if necessary
      if (newStreak > (this.stats.longestStreaks?.[habitId] || 0)) {
        // Ensure longestStreaks object exists and is mutable
        if (!this.stats.longestStreaks) {
          this.stats.longestStreaks = {}
        }
        
        this.stats.longestStreaks = {
          ...this.stats.longestStreaks,
          [habitId]: newStreak
        }
      }
      
      return { ...this.stats }
    } catch (error) {
      console.error('Error updating streak:', error)
      // Fallback: recreate stats object if assignment fails
      this.stats = this.deepClone({
        ...this.stats,
        currentStreaks: {
          ...this.stats.currentStreaks,
          [habitId]: newStreak
        },
        longestStreaks: {
          ...this.stats.longestStreaks,
          [habitId]: newStreak > (this.stats.longestStreaks?.[habitId] || 0) ? newStreak : this.stats.longestStreaks?.[habitId]
        }
      })
      return { ...this.stats }
    }
  }

  async incrementDaysTracked() {
    await this.delay()
    this.stats.totalDaysTracked += 1
    this.stats.lastActivityDate = new Date().toISOString()
    return { ...this.stats }
  }

  async calculateCompletionRate(totalCheckIns, totalPossible) {
    await this.delay()
    const rate = totalPossible > 0 ? totalCheckIns / totalPossible : 0
    this.stats.completionRate = Math.round(rate * 100) / 100
    return this.stats.completionRate
  }

  async resetStats() {
    await this.delay()
    this.stats = {
      level: 1,
      experience: 0,
      totalDaysTracked: 0,
      currentStreaks: {},
      longestStreaks: {},
      completionRate: 0,
      totalHabits: 0,
      totalCheckIns: 0,
      perfectDays: 0,
      lastActivityDate: new Date().toISOString()
    }
    return { ...this.stats }
  }
}

export default new UserService()