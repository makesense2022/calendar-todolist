import React, { useEffect, useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useDateStore } from '@/store/useDateStore';
import { useTodoStore } from '@/store/useTodoStore';

interface MonthViewProps {
  onDayClick: (date: Date) => void;
}

interface DayProps {
  date: Date;
  isCurrentMonth: boolean;
  todos: any[];
  onClick: (date: Date) => void;
}

const Day: React.FC<DayProps> = ({ date, isCurrentMonth, todos, onClick }) => {
  const isCurrentDay = isToday(date);
  
  return (
    <div 
      className={`h-24 sm:h-28 border p-1 ${
        isCurrentMonth ? 'bg-white' : 'bg-gray-50'
      } ${isCurrentDay ? 'border-blue-500' : 'border-gray-200'}`}
      onClick={() => onClick(date)}
    >
      <div className="flex justify-between">
        <div
          className={`text-sm w-6 h-6 flex items-center justify-center rounded-full ${
            isCurrentDay ? 'bg-blue-500 text-white' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </div>
      </div>
      
      {todos.length > 0 ? (
        <div className="mt-1 overflow-y-auto max-h-[calc(100%-2rem)]">
          {todos.slice(0, 3).map((todo) => (
            <div 
              key={todo.id}
              className={`text-xs mb-1 truncate rounded py-1 px-1.5 ${
                todo.completed 
                  ? 'line-through text-gray-400 bg-gray-50' 
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              <span className="mr-1">
                {todo.completed ? '✓' : ''}
              </span>
              {todo.title}
            </div>
          ))}
          {todos.length > 3 && (
            <div className="text-xs text-gray-500 py-0.5">
              +{todos.length - 3} 更多
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-3/4 text-gray-300 text-xs">
          <span>点击添加</span>
        </div>
      )}
    </div>
  );
};

const MonthView: React.FC<MonthViewProps> = ({ onDayClick }) => {
  const { currentDate } = useDateStore();
  const { todos } = useTodoStore();
  
  const calendarDays = useMemo(() => {
    // 获取当前月份的第一天和最后一天
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // 获取日历第一天和最后一天（包括上个月和下个月的部分日期）
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 周一开始
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    // 获取日历中的所有日期
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);
  
  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(2021, 0, i + 1); // 使用周一开始的周顺序
      return format(date, 'E', { locale: zhCN });
    });
  }, []);
  
  // 按日期分组待办事项
  const todosByDate = useMemo(() => {
    const result: { [key: string]: any[] } = {};
    
    todos.forEach(todo => {
      const key = todo.date;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(todo);
    });
    
    return result;
  }, [todos]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-7 gap-0 border-b border-l text-sm text-center font-medium">
        {weekdays.map((day, index) => (
          <div key={index} className="py-2 px-1 border-r">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-0 border-b">
          {calendarDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTodos = todosByDate[dateKey] || [];
            
            return (
              <Day
                key={dateKey}
                date={day}
                isCurrentMonth={isSameMonth(day, currentDate)}
                todos={dayTodos}
                onClick={onDayClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView; 