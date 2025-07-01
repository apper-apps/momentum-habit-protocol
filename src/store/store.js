import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "@/store/slices/habitSlice";
import userReducer from "@/store/slices/userSlice";
import achievementReducer from "@/store/slices/achievementSlice";

export const store = configureStore({
  reducer: {
    habits: habitReducer,
    user: userReducer,
    achievements: achievementReducer,
  },
});