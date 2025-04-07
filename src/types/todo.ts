export type Priority = 'low' | 'medium' | 'high';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export type ViewType = 'day' | 'week' | 'month';

export interface Todo {
  id: string;
  title: string;
  date: string; // 格式 "YYYY-MM-DD"
  time?: string; // 格式 "HH:MM"
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  repeat: RepeatType;
  reminder?: Date;
  note?: string;
}

export interface CalendarViewType {
  type: 'month' | 'week' | 'day';
} 