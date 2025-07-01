import { toast } from 'react-toastify'

class AchievementService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } },
          { field: { Name: "unlocked_at" } },
          { field: { Name: "points" } },
          { field: { Name: "category" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await this.apperClient.getRecordById('achievement', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } },
          { field: { Name: "unlocked_at" } },
          { field: { Name: "points" } },
          { field: { Name: "category" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching achievement with ID ${id}:`, error);
      toast.error("Failed to load achievement");
      return null;
    }
  }

  async getUnlocked() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } },
          { field: { Name: "unlocked_at" } },
          { field: { Name: "points" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "unlocked_at",
            Operator: "HasValue",
            Values: []
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching unlocked achievements:", error);
      toast.error("Failed to load unlocked achievements");
      return [];
    }
  }

  async getLocked() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } },
          { field: { Name: "unlocked_at" } },
          { field: { Name: "points" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "unlocked_at",
            Operator: "DoesNotHaveValue",
            Values: []
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching locked achievements:", error);
      toast.error("Failed to load locked achievements");
      return [];
    }
  }

  async unlock(id) {
    try {
      // First check if already unlocked
      const achievement = await this.getById(id);
      if (!achievement) {
        throw new Error('Achievement not found');
      }

      if (achievement.unlocked_at) {
        return null; // Already unlocked
      }

      const params = {
        records: [{
          Id: parseInt(id),
          unlocked_at: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord('achievement', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to unlock ${failedUpdates.length} achievements:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const unlockedAchievement = { ...achievement, unlocked_at: new Date().toISOString() };
          toast.success(`Achievement unlocked: ${achievement.Name}!`);
          return unlockedAchievement;
        }
      }

      return null;
    } catch (error) {
      console.error("Error unlocking achievement:", error);
      toast.error("Failed to unlock achievement");
      return null;
    }
  }

  async checkAchievements(userStats, habits, checkIns) {
    try {
      const allAchievements = await this.getAll();
      const newlyUnlocked = [];

      // Check each achievement condition
      for (const achievement of allAchievements) {
        if (achievement.unlocked_at) continue; // Already unlocked

        let shouldUnlock = false;

        switch (achievement.Id) {
          case 1: // First Step
            shouldUnlock = checkIns.some(c => c.completed);
            break;
          case 2: // Streak Starter
            shouldUnlock = Object.values(userStats.currentStreaks || {}).some(streak => streak >= 3);
            break;
          case 3: // Habit Master
            shouldUnlock = habits.length >= 5;
            break;
          case 4: // Consistency Champion
            shouldUnlock = Object.values(userStats.currentStreaks || {}).some(streak => streak >= 7);
            break;
          case 5: // Wellness Warrior
            const wellnessHabits = habits.filter(h => h.category === 'Wellness');
            const wellnessCheckIns = checkIns.filter(c => 
              wellnessHabits.some(h => h.Id === c.habit_id) && c.completed
            );
            shouldUnlock = wellnessCheckIns.length >= 30;
            break;
          case 6: // Early Bird
            const earlyCheckIns = checkIns.filter(c => {
              const hour = new Date(c.date).getHours();
              return hour < 8 && c.completed;
            });
            shouldUnlock = earlyCheckIns.length >= 5;
            break;
          case 7: // Perfect Week
            shouldUnlock = (userStats.perfectDays || 0) >= 7;
            break;
          case 8: // Habit Architect
            const activeStreaks = Object.values(userStats.currentStreaks || {}).filter(s => s > 0);
            shouldUnlock = activeStreaks.length >= 5;
            break;
        }

        if (shouldUnlock) {
          const unlockedAchievement = await this.unlock(achievement.Id);
          if (unlockedAchievement) {
            newlyUnlocked.push(unlockedAchievement);
          }
        }
      }

      return newlyUnlocked;
    } catch (error) {
      console.error("Error checking achievements:", error);
      toast.error("Failed to check achievements");
      return [];
    }
  }

  async getTotalPoints() {
    try {
      const unlockedAchievements = await this.getUnlocked();
      return unlockedAchievements.reduce((total, achievement) => total + (achievement.points || 0), 0);
    } catch (error) {
      console.error("Error calculating total points:", error);
      toast.error("Failed to calculate total points");
      return 0;
    }
  }

  async getProgressByCategory() {
    try {
      const allAchievements = await this.getAll();
      const categories = [...new Set(allAchievements.map(a => a.category))];
      const progress = {};

      categories.forEach(category => {
        const categoryAchievements = allAchievements.filter(a => a.category === category);
        const unlockedCount = categoryAchievements.filter(a => a.unlocked_at !== null).length;
        progress[category] = {
          unlocked: unlockedCount,
          total: categoryAchievements.length,
          percentage: Math.round((unlockedCount / categoryAchievements.length) * 100)
        };
      });

      return progress;
    } catch (error) {
      console.error("Error fetching progress by category:", error);
      toast.error("Failed to load achievement progress");
      return {};
    }
  }
}

export default new AchievementService()