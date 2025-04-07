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
  addWeeks,
  isSameDay
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTodoStore } from '@/store/useTodoStore';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';
import { FiClipboard } from 'react-icons/fi';
import { useDateStore } from '../../../store/useDateStore';

interface DayProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  todos: Todo[];
  onClick: (date: Date) => void;
}

const Day: React.FC<DayProps> = ({ day, isCurrentMonth, isToday, isSelected, todos, onClick }) => {
  return (
    <div 
      className={`
        relative h-full border border-gray-200 p-1 transition-colors
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} 
        ${isToday ? 'ring-2 ring-indigo-500 ring-inset' : ''}
        ${isSelected ? 'bg-indigo-50' : ''}
        hover:bg-gray-50 cursor-pointer
      `}
      onClick={() => onClick(day)}
    >
      <div className="flex flex-col h-full">
        <div className="text-right mb-1">
          <span className={`
            flex items-center justify-center w-7 h-7 ml-auto text-sm font-medium
            ${isToday ? 'bg-indigo-500 text-white rounded-full' : ''}
          `}>
            {format(day, 'd')}
          </span>
        </div>
        <div className="overflow-y-auto flex-grow">
          {todos.slice(0, 3).map((todo) => (
            <div 
              key={todo.id} 
              className={`
                mb-1 px-2 py-1 rounded-md text-xs truncate
                ${todo.priority === 'high' ? 'bg-red-100 text-red-800' : 
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'}
                ${todo.completed ? 'line-through opacity-60' : ''}
              `}
            >
              {todo.title}
            </div>
          ))}
          {todos.length > 3 && (
            <div className="text-xs text-gray-500 px-2">
              +{todos.length - 3} 更多
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MonthViewProps {
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ onDayClick }) => {
  const { currentDate } = useDateStore();
  const { todos } = useTodoStore();
  const [days, setDays] = useState<Date[]>([]);
  
  // 一周中的每一天
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  useEffect(() => {
    // 当前月份的开始和结束
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    
    // 日历视图的开始和结束（包括上月和下月的部分日期）
    const calendarStart = startOfWeek(monthStart, { locale: zhCN });
    // 确保日历至少显示6周，以便显示完整月份和必要的前后月份日期
    let calendarEnd = endOfWeek(monthEnd, { locale: zhCN });
    
    // 计算日历网格行数，确保有足够的行显示所有日期
    const calendarStartDay = calendarStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const requiredRows = Math.ceil((calendarStartDay + daysInMonth) / 7);
    
    // 如果需要6行，调整日历结束日期
    if (requiredRows > 5) {
      calendarEnd = endOfWeek(addWeeks(monthStart, 5), { locale: zhCN });
    }
    
    // 生成日历网格的日期数组
    const daysInCalendar = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
    
    setDays(daysInCalendar);
  }, [currentDate]);
  
  // 计算是否显示"点击任意日期创建新任务"的提示
  const showEmptyState = days.length > 0 && days.every(day => todos.filter(todo => {
    if (!todo.date) return false;
    return isSameDay(new Date(todo.date), day);
  }).length === 0);

  return (
    <motion.div 
      className="h-full overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 星期栏 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日历格子 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 grid-rows-6 h-full">
          {days.map((day) => {
            const isInCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isSameDay(day, new Date());
            const dayTodos = todos.filter(todo => {
              if (!todo.date) return false;
              return isSameDay(new Date(todo.date), day);
            });
            
            return (
              <Day
                key={day.toString()}
                day={day}
                isCurrentMonth={isInCurrentMonth}
                isToday={isCurrentDay}
                isSelected={false}
                todos={dayTodos}
                onClick={onDayClick}
              />
            );
          })}
        </div>
      </div>
      
      {/* 提示文本 */}
      {showEmptyState && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 pointer-events-none">
          <div className="text-center text-gray-500">
            <p className="text-lg">点击任意日期创建新任务</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MonthView; 