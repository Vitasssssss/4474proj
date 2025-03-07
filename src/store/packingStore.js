import { create } from 'zustand';

export const usePackingStore = create((set) => ({
  currentList: null,
  defaultLists: [],
  
  createNewList: (tripDetails) => {
    set({
      currentList: {
        id: crypto.randomUUID(),
        tripDetails,
        schedule: [],
        defaultItems: []
      }
    });
  },

  addActivity: (date, activity) => {
    set((state) => {
      if (!state.currentList) return state;
      
      const existingDayIndex = state.currentList.schedule.findIndex(
        (day) => day.date === date
      );

      const updatedSchedule = [...state.currentList.schedule];
      
      if (existingDayIndex >= 0) {
        updatedSchedule[existingDayIndex].activities.push(activity);
      } else {
        updatedSchedule.push({
          date,
          activities: [activity]
        });
      }

      return {
        currentList: {
          ...state.currentList,
          schedule: updatedSchedule
        }
      };
    });
  },

  addItem: (date, activityId, item) => {
    set((state) => {
      if (!state.currentList) return state;

      const updatedSchedule = state.currentList.schedule.map((day) => {
        if (day.date !== date) return day;

        return {
          ...day,
          activities: day.activities.map((activity) => {
            if (activity.id !== activityId) return activity;

            return {
              ...activity,
              items: [...activity.items, item]
            };
          })
        };
      });

      return {
        currentList: {
          ...state.currentList,
          schedule: updatedSchedule
        }
      };
    });
  },

  toggleItemPacked: (date, activityId, itemId) => {
    set((state) => {
      if (!state.currentList) return state;

      const updatedSchedule = state.currentList.schedule.map((day) => {
        if (day.date !== date) return day;

        return {
          ...day,
          activities: day.activities.map((activity) => {
            if (activity.id !== activityId) return activity;

            return {
              ...activity,
              items: activity.items.map((item) => {
                if (item.id !== itemId) return item;
                return { ...item, packed: !item.packed };
              })
            };
          })
        };
      });

      return {
        currentList: {
          ...state.currentList,
          schedule: updatedSchedule
        }
      };
    });
  },

  saveAsDefault: (name) => {
    set((state) => {
      if (!state.currentList) return state;
      
      return {
        defaultLists: [
          ...state.defaultLists,
          {
            ...state.currentList,
            tripDetails: {
              ...state.currentList.tripDetails,
              name
            }
          }
        ]
      };
    });
  }
}));