import { format, isToday } from 'date-fns'
import { toast } from 'react-toastify'

class HabitService {
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
          { field: { Name: "category" } },
          { field: { Name: "frequency" } },
          { field: { Name: "target" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "created_at" } },
          { field: { Name: "color" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('habit', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits");
      return [];
    }
  }

  async getById(id) {
    try {
      const response = await this.apperClient.getRecordById('habit', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "frequency" } },
          { field: { Name: "target" } },
          { field: { Name: "difficulty" } },
          { field: { Name: "created_at" } },
          { field: { Name: "color" } },
          { field: { Name: "description" } },
          { field: { Name: "icon" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching habit with ID ${id}:`, error);
      toast.error("Failed to load habit");
      return null;
    }
  }

  async create(habitData) {
    try {
      const params = {
        records: [{
          Name: habitData.name || habitData.Name,
          category: habitData.category,
          frequency: habitData.frequency,
          target: habitData.target,
          difficulty: habitData.difficulty,
          created_at: new Date().toISOString(),
          color: habitData.color,
          description: habitData.description,
          icon: habitData.icon
        }]
      };

      const response = await this.apperClient.createRecord('habit', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} habits:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Habit created successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
      return null;
    }
  }

  async update(id, updates) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updates.name || updates.Name,
          category: updates.category,
          frequency: updates.frequency,
          target: updates.target,
          difficulty: updates.difficulty,
          color: updates.color,
          description: updates.description,
          icon: updates.icon
        }]
      };

      const response = await this.apperClient.updateRecord('habit', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} habits:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Habit updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating habit:", error);
      toast.error("Failed to update habit");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('habit', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} habits:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Habit deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
      return false;
    }
  }

  async getAllCheckIns() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "habit_id" } },
          { field: { Name: "date" } },
          { field: { Name: "completed" } },
          { field: { Name: "notes" } },
          { field: { Name: "mood" } }
        ]
      };

      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching check-ins:", error);
      toast.error("Failed to load check-ins");
      return [];
    }
  }

  async getCheckInsByHabit(habitId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "habit_id" } },
          { field: { Name: "date" } },
          { field: { Name: "completed" } },
          { field: { Name: "notes" } },
          { field: { Name: "mood" } }
        ],
        where: [
          {
            FieldName: "habit_id",
            Operator: "EqualTo",
            Values: [parseInt(habitId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching check-ins by habit:", error);
      toast.error("Failed to load habit check-ins");
      return [];
    }
  }

  async getTodaysCheckIns() {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "habit_id" } },
          { field: { Name: "date" } },
          { field: { Name: "completed" } },
          { field: { Name: "notes" } },
          { field: { Name: "mood" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "ExactMatch",
            SubOperator: "Day",
            Values: [format(new Date(), 'd MMM yyyy')]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('check_in', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's check-ins:", error);
      toast.error("Failed to load today's check-ins");
      return [];
    }
  }

  async createCheckIn(checkInData) {
    try {
      const params = {
        records: [{
          Name: checkInData.name || `Check-in for habit ${checkInData.habit_id}`,
          habit_id: parseInt(checkInData.habit_id || checkInData.habitId),
          date: checkInData.date || new Date().toISOString(),
          completed: checkInData.completed,
          notes: checkInData.notes || "",
          mood: checkInData.mood || 3
        }]
      };

      const response = await this.apperClient.createRecord('check_in', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} check-ins:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          toast.success('Check-in recorded successfully');
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating check-in:", error);
      toast.error("Failed to record check-in");
      return null;
    }
  }

  async updateCheckIn(id, updates) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updates.name,
          completed: updates.completed,
          notes: updates.notes,
          mood: updates.mood
        }]
      };

      const response = await this.apperClient.updateRecord('check_in', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} check-ins:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Check-in updated successfully');
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating check-in:", error);
      toast.error("Failed to update check-in");
      return null;
    }
  }

  async getHabitStreaks(habitId) {
    try {
      const checkIns = await this.getCheckInsByHabit(habitId);
      const completedCheckIns = checkIns
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // Calculate current streak
      const today = new Date();
      let checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) { // Check last 30 days
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const hasCheckIn = completedCheckIns.some(c => 
          format(new Date(c.date), 'yyyy-MM-dd') === dateStr
        );
        
        if (hasCheckIn) {
          currentStreak++;
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) {
            // If no check-in today, look at yesterday
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }

      return {
        current: currentStreak,
        longest: longestStreak,
        total: completedCheckIns.length
      };
    } catch (error) {
      console.error("Error calculating habit streaks:", error);
      toast.error("Failed to calculate streaks");
      return {
        current: 0,
        longest: 0,
        total: 0
      };
    }
  }

  async getHabitCategories() {
    try {
      const habits = await this.getAll();
      const categories = [...new Set(habits.map(h => h.category))];
      return categories;
    } catch (error) {
      console.error("Error fetching habit categories:", error);
      toast.error("Failed to load habit categories");
      return [];
    }
  }
}

export default new HabitService()