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
      className={`calendar-cell ${isCurrentDay ? 'today' : ''} ${
        isCurrentMonth ? '' : 'bg-gray-50'
      }`}
      onClick={() => onClick(date)}
    >
      <div className="flex justify-between">
        <div
          className={`calendar-date ${isCurrentDay ? 'today' : ''} ${
            isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
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
              className={`tech-task text-xs ${todo.completed ? 'completed' : ''} my-0 py-1`}
              style={{
                borderLeftColor: todo.completed ? 'var(--success)' : 
                               todo.priority === 'high' ? 'var(--danger)' : 
                               todo.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
              }}
            >
              <span className="mr-1">
                {todo.completed ? '✓' : ''}
              </span>
              {todo.title}
            </div>
          ))}
          {todos.length > 3 && (
            <div className="text-xs bg-blue-50 text-blue-700 rounded-md px-2 py-1 mt-1 text-center">
              +{todos.length - 3} 更多
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-3/4 text-gray-300 text-xs">
          <span className="hover:text-blue-400 transition-colors">点击添加</span>
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
    // 直接指定星期顺序为周一到周日
    return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
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
      <div className="grid grid-cols-7 gap-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-t-lg overflow-hidden">
        {weekdays.map((day, index) => (
          <div key={index} className="py-3 text-center">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="grid grid-cols-7 gap-0">
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