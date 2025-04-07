import React, { useState, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isToday,
  isSameDay
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTodoStore } from '@/store/useTodoStore';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';

interface DayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  todos: Todo[];
  onDayClick: (date: Date) => void;
}

const DayCell: React.FC<DayProps> = ({ 
  date, 
  isCurrentMonth, 
  isToday: isCurrentDay, 
  todos, 
  onDayClick 
}) => {
  const dayNumber = format(date, 'd');
  
  // 任务点标记，最多显示3个
  const taskDots = todos.slice(0, 3).map((todo, index) => (
    <div 
      key={todo.id} 
      className={`task-dot ${todo.priority === 'high' 
        ? 'priority-high' 
        : todo.priority === 'medium' 
          ? 'priority-medium' 
          : 'priority-low'}`}
    />
  ));
  
  // 如果有更多任务，显示一个加号指示器
  const hasMoreTasks = todos.length > 3;
  
  return (
    <div 
      className={`calendar-cell border ${
        isCurrentMonth ? 'bg-transparent' : 'bg-gray-100/50 text-gray-400'
      } ${isCurrentDay ? 'bg-primary/10' : ''}`}
      onClick={() => onDayClick(date)}
    >
      <div className={`
        h-8 w-8 flex items-center justify-center rounded-full mb-1
        ${isCurrentDay ? 'bg-primary text-white' : ''}
      `}>
        {dayNumber}
      </div>
      
      {todos.length > 0 && (
        <div className="flex flex-wrap justify-center mt-1 max-w-[70%]">
          {taskDots}
          {hasMoreTasks && (
            <span className="text-xs text-gray-500 ml-1">+{todos.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface MonthViewProps {
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ onDayClick }) => {
  const { currentDate, getTodosByDate } = useTodoStore();
  const [days, setDays] = useState<Date[]>([]);
  
  // 当前月份的开始和结束
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // 日历视图的开始和结束（包括上月和下月的部分日期）
  const calendarStart = startOfWeek(monthStart, { locale: zhCN });
  const calendarEnd = endOfWeek(monthEnd, { locale: zhCN });
  
  // 一周中的每一天
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  useEffect(() => {
    // 生成日历网格的日期数组
    const daysInMonth = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
    
    setDays(daysInMonth);
  }, [currentDate]);
  
  return (
    <div className="flex flex-col h-full">
      {/* 星期标题行 */}
      <div className="calendar-grid border-b text-center py-2 font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <motion.div 
        className="calendar-grid flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {days.map((day) => {
          const isInCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const dayTodos = getTodosByDate(day);
          
          return (
            <DayCell
              key={day.toString()}
              date={day}
              isCurrentMonth={isInCurrentMonth}
              isToday={isCurrentDay}
              todos={dayTodos}
              onDayClick={onDayClick}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default MonthView; 