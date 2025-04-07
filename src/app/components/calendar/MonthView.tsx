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
  
  // 渲染任务点
  const renderTaskDots = () => {
    return todos.slice(0, 3).map((todo, index) => {
      let dotColorClass = 'bg-green-500'; // 默认低优先级
      
      if (todo.priority === 'high') {
        dotColorClass = 'bg-red-500';
      } else if (todo.priority === 'medium') {
        dotColorClass = 'bg-yellow-500';
      }
      
      return <div key={todo.id} className={`w-1.5 h-1.5 rounded-full ${dotColorClass} m-0.5`} />;
    });
  };
  
  // 如果有更多任务，显示一个加号指示器
  const hasMoreTasks = todos.length > 3;
  
  return (
    <div 
      className={`h-full flex flex-col items-center justify-center relative cursor-pointer transition-all border border-gray-200
        ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : ''} 
        ${isCurrentDay ? 'bg-indigo-50/50' : ''}`}
      onClick={() => onDayClick(date)}
    >
      <div className={`h-8 w-8 flex items-center justify-center rounded-full mb-1 
        ${isCurrentDay ? 'bg-indigo-600 text-white' : ''}`}>
        {dayNumber}
      </div>
      
      {todos.length > 0 ? (
        <div className="flex flex-wrap justify-center mt-1 max-w-[70%]">
          {renderTaskDots()}
          {hasMoreTasks && (
            <span className="text-xs text-gray-500 ml-1">+{todos.length - 3}</span>
          )}
        </div>
      ) : isCurrentDay && isCurrentMonth ? (
        <div className="flex flex-col items-center text-center">
          <FiClipboard className="text-gray-800 mb-1" size={18} />
          <span className="text-xs text-gray-500">今天没有任务</span>
        </div>
      ) : null}
    </div>
  );
};

interface MonthViewProps {
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ onDayClick }) => {
  const { currentDate, getTodosByDate } = useTodoStore();
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
  const showEmptyState = days.length > 0 && days.every(day => getTodosByDate(day).length === 0);

  return (
    <div className="flex flex-col h-full">
      {/* 星期标题行 */}
      <div className="grid grid-cols-7 border-b border-gray-200 py-2 text-center text-gray-500 font-medium">
        {weekDays.map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <motion.div 
        className="grid grid-cols-7 grid-rows-6 flex-grow h-[calc(100%-40px)]"
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
      
      {/* 空状态提示 */}
      {showEmptyState && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-lg p-4 shadow-sm text-center">
          <p className="text-gray-500 text-sm">点击任意日期创建新任务</p>
        </div>
      )}
    </div>
  );
};

export default MonthView; 