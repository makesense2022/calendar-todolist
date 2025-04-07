import { create } from 'zustand';
import { addDays, subDays, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  goToToday: () => void;
  goToNextDay: () => void;
  goToPrevDay: () => void;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
}

export const useDateStore = create<DateState>((set) => ({
  currentDate: new Date(),
  
  setCurrentDate: (date) => set({ currentDate: date }),
  
  goToToday: () => set({ currentDate: new Date() }),
  
  goToNextDay: () => set((state) => ({
    currentDate: addDays(state.currentDate, 1),
  })),
  
  goToPrevDay: () => set((state) => ({
    currentDate: subDays(state.currentDate, 1),
  })),
  
  goToNextWeek: () => set((state) => ({
    currentDate: addWeeks(state.currentDate, 1),
  })),
  
  goToPrevWeek: () => set((state) => ({
    currentDate: subWeeks(state.currentDate, 1),
  })),
  
  goToNextMonth: () => set((state) => ({
    currentDate: addMonths(state.currentDate, 1),
  })),
  
  goToPrevMonth: () => set((state) => ({
    currentDate: subMonths(state.currentDate, 1),
  })),
})); 