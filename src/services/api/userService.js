import { toast } from 'react-toastify'

class UserService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getStats() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "level" } },
          { field: { Name: "experience" } },
          { field: { Name: "total_days_tracked" } },
          { field: { Name: "current_streaks" } },
          { field: { Name: "longest_streaks" } },
          { field: { Name: "completion_rate" } },
          { field: { Name: "total_habits" } },
          { field: { Name: "total_check_ins" } },
          { field: { Name: "perfect_days" } },
          { field: { Name: "last_activity_date" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('user_stat', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Return first user stat record or default values
      if (response.data && response.data.length > 0) {
        const userStat = response.data[0];
        return {
          level: userStat.level || 1,
          experience: userStat.experience || 0,
          totalDaysTracked: userStat.total_days_tracked || 0,
          currentStreaks: userStat.current_streaks ? JSON.parse(userStat.current_streaks) : {},
          longestStreaks: userStat.longest_streaks ? JSON.parse(userStat.longest_streaks) : {},
          completionRate: userStat.completion_rate || 0,
          totalHabits: userStat.total_habits || 0,
          totalCheckIns: userStat.total_check_ins || 0,
          perfectDays: userStat.perfect_days || 0,
          lastActivityDate: userStat.last_activity_date || new Date().toISOString()
        };
      }

      return {
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
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("Failed to load user statistics");
      return null;
    }
  }

  async updateStats(updates) {
    try {
      // Get current stats first
      const currentStats = await this.getStats();
      if (!currentStats) throw new Error('Could not fetch current stats');

      const updatedStats = { ...currentStats, ...updates };

      const params = {
        records: [{
          Id: 1, // Assuming single user stat record
          level: updatedStats.level,
          experience: updatedStats.experience,
          total_days_tracked: updatedStats.totalDaysTracked,
          current_streaks: JSON.stringify(updatedStats.currentStreaks),
          longest_streaks: JSON.stringify(updatedStats.longestStreaks),
          completion_rate: updatedStats.completionRate,
          total_habits: updatedStats.totalHabits,
          total_check_ins: updatedStats.totalCheckIns,
          perfect_days: updatedStats.perfectDays,
          last_activity_date: updatedStats.lastActivityDate
        }]
      };

      const response = await this.apperClient.updateRecord('user_stat', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('User statistics updated successfully');
          return updatedStats;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating user stats:", error);
      toast.error("Failed to update user statistics");
      return null;
    }
  }

  async addExperience(points) {
    try {
      const currentStats = await this.getStats();
      if (!currentStats) throw new Error('Could not fetch current stats');

      const newExperience = currentStats.experience + points;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const levelUp = newLevel > currentStats.level;

      const updatedStats = {
        ...currentStats,
        experience: newExperience,
        level: newLevel
      };

      const result = await this.updateStats(updatedStats);
      
      if (result) {
        if (levelUp) {
          toast.success(`Level up! You're now level ${newLevel}`);
          return { levelUp: true, newLevel, ...result };
        } else {
          toast.success(`+${points} XP earned!`);
        }
        return result;
      }

      return null;
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("Failed to add experience points");
      return null;
    }
  }

  async updateStreak(habitId, newStreak) {
    try {
      const currentStats = await this.getStats();
      if (!currentStats) throw new Error('Could not fetch current stats');

      const updatedCurrentStreaks = {
        ...currentStats.currentStreaks,
        [habitId]: newStreak
      };

      const updatedLongestStreaks = { ...currentStats.longestStreaks };
      if (newStreak > (currentStats.longestStreaks[habitId] || 0)) {
        updatedLongestStreaks[habitId] = newStreak;
      }

      const updatedStats = {
        ...currentStats,
        currentStreaks: updatedCurrentStreaks,
        longestStreaks: updatedLongestStreaks
      };

      const result = await this.updateStats(updatedStats);
      if (result) {
        toast.success(`Streak updated to ${newStreak} days!`);
      }
      return result;
    } catch (error) {
      console.error("Error updating streak:", error);
      toast.error("Failed to update streak");
      return null;
    }
  }

  async incrementDaysTracked() {
    try {
      const currentStats = await this.getStats();
      if (!currentStats) throw new Error('Could not fetch current stats');

      const updatedStats = {
        ...currentStats,
        totalDaysTracked: currentStats.totalDaysTracked + 1,
        lastActivityDate: new Date().toISOString()
      };

      return await this.updateStats(updatedStats);
    } catch (error) {
      console.error("Error incrementing days tracked:", error);
      toast.error("Failed to update tracking data");
      return null;
    }
  }

  async calculateCompletionRate(totalCheckIns, totalPossible) {
    try {
      const currentStats = await this.getStats();
      if (!currentStats) throw new Error('Could not fetch current stats');

      const rate = totalPossible > 0 ? totalCheckIns / totalPossible : 0;
      const completionRate = Math.round(rate * 100) / 100;

      const updatedStats = {
        ...currentStats,
        completionRate
      };

      const result = await this.updateStats(updatedStats);
      return result ? completionRate : null;
    } catch (error) {
      console.error("Error calculating completion rate:", error);
      toast.error("Failed to calculate completion rate");
      return null;
    }
  }

  async resetStats() {
    try {
      const resetData = {
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
      };

      const result = await this.updateStats(resetData);
      if (result) {
        toast.success('User statistics reset successfully');
      }
      return result;
    } catch (error) {
      console.error("Error resetting stats:", error);
      toast.error("Failed to reset user statistics");
      return null;
    }
  }
}

export default new UserService()