import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CalendarViewType } from '@/types/todo';

interface ViewStore {
  view: CalendarViewType['type'];
  setView: (view: CalendarViewType['type']) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      view: 'month',
      setView: (view: CalendarViewType['type']) => set({ view }),
    }),
    {
      name: 'view-storage',
    }
  )
); 