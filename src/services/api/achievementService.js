import achievementsData from '@/services/mockData/achievements.json'

class AchievementService {
  constructor() {
    this.achievements = [...achievementsData]
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.achievements]
  }

  async getById(id) {
    await this.delay()
    return this.achievements.find(achievement => achievement.Id === parseInt(id))
  }

  async getUnlocked() {
    await this.delay()
    return this.achievements.filter(achievement => achievement.unlockedAt !== null)
  }

  async getLocked() {
    await this.delay()
    return this.achievements.filter(achievement => achievement.unlockedAt === null)
  }

  async unlock(id) {
    await this.delay()
    const index = this.achievements.findIndex(achievement => achievement.Id === parseInt(id))
    if (index === -1) throw new Error('Achievement not found')
    
    if (!this.achievements[index].unlockedAt) {
      this.achievements[index].unlockedAt = new Date().toISOString()
      return { ...this.achievements[index] }
    }
    
    return null // Already unlocked
  }

  async checkAchievements(userStats, habits, checkIns) {
    await this.delay()
    const newlyUnlocked = []

    // Check each achievement condition
    for (const achievement of this.achievements) {
      if (achievement.unlockedAt) continue // Already unlocked

      let shouldUnlock = false

      switch (achievement.Id) {
        case 1: // First Step
          shouldUnlock = checkIns.some(c => c.completed)
          break
        case 2: // Streak Starter
          shouldUnlock = Object.values(userStats.currentStreaks).some(streak => streak >= 3)
          break
        case 3: // Habit Master
          shouldUnlock = habits.length >= 5
          break
        case 4: // Consistency Champion
          shouldUnlock = Object.values(userStats.currentStreaks).some(streak => streak >= 7)
          break
        case 5: // Wellness Warrior
          const wellnessHabits = habits.filter(h => h.category === 'Wellness')
          const wellnessCheckIns = checkIns.filter(c => 
            wellnessHabits.some(h => h.Id === c.habitId) && c.completed
          )
          shouldUnlock = wellnessCheckIns.length >= 30
          break
        case 6: // Early Bird
          const earlyCheckIns = checkIns.filter(c => {
            const hour = new Date(c.date).getHours()
            return hour < 8 && c.completed
          })
          shouldUnlock = earlyCheckIns.length >= 5
          break
        case 7: // Perfect Week
          shouldUnlock = userStats.perfectDays >= 7
          break
        case 8: // Habit Architect
          const activeStreaks = Object.values(userStats.currentStreaks).filter(s => s > 0)
          shouldUnlock = activeStreaks.length >= 5
          break
      }

      if (shouldUnlock) {
        achievement.unlockedAt = new Date().toISOString()
        newlyUnlocked.push({ ...achievement })
      }
    }

    return newlyUnlocked
  }

  async getTotalPoints() {
    await this.delay()
    return this.achievements
      .filter(a => a.unlockedAt !== null)
      .reduce((total, achievement) => total + achievement.points, 0)
  }

  async getProgressByCategory() {
    await this.delay()
    const categories = [...new Set(this.achievements.map(a => a.category))]
    const progress = {}

    categories.forEach(category => {
      const categoryAchievements = this.achievements.filter(a => a.category === category)
      const unlockedCount = categoryAchievements.filter(a => a.unlockedAt !== null).length
      progress[category] = {
        unlocked: unlockedCount,
        total: categoryAchievements.length,
        percentage: Math.round((unlockedCount / categoryAchievements.length) * 100)
      }
    })

    return progress
  }
}

export default new AchievementService()