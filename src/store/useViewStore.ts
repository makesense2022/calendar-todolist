import { create } from 'zustand';
import { ViewType } from '@/types/todo';

interface ViewState {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'month',
  setCurrentView: (view) => set({ currentView: view }),
})); 