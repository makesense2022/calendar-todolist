export type Priority = 'low' | 'medium' | 'high';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Todo {
  id: string;
  title: string;
  date: string; // ISO 格式的日期字符串: YYYY-MM-DD
  time?: string; // 格式: HH:MM，可选
  priority: Priority;
  note?: string;
  completed: boolean;
  repeat: RepeatType;
  reminder?: string; // ISO 格式的日期时间字符串
  createdAt: string; // ISO 格式的日期时间字符串
  updatedAt: string; // ISO 格式的日期时间字符串
}

export interface CalendarViewType {
  type: 'month' | 'week' | 'day';
} 