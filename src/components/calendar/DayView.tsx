import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useDateStore } from '@/store/useDateStore';
import { useTodoStore } from '@/store/useTodoStore';

interface DayViewProps {
  onDayClick: (date: Date) => void;
}

const HourRow: React.FC<{ hour: number, todos: any[] }> = ({ hour, todos }) => {
  // 过滤出该小时的任务
  const hourTodos = todos.filter(todo => {
    if (!todo.time) return false;
    const [todoHour] = todo.time.split(':').map(Number);
    return todoHour === hour;
  });

  return (
    <div className="flex border-b border-gray-200 h-16">
      <div className="w-16 flex-shrink-0 border-r border-gray-200 text-xs text-gray-500 flex items-center justify-center">
        {hour}:00
      </div>
      <div className="flex-1 p-1">
        {hourTodos.map(todo => (
          <div 
            key={todo.id}
            className={`text-sm py-1 px-2 mb-1 rounded ${
              todo.completed 
                ? 'line-through bg-gray-100 text-gray-500' 
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {todo.title}
            {todo.time && (
              <span className="ml-2 text-xs text-gray-500">{todo.time}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DayView: React.FC<DayViewProps> = ({ onDayClick }) => {
  const { currentDate } = useDateStore();
  const { todos } = useTodoStore();
  
  // 获取当天的任务
  const dayTodos = useMemo(() => {
    const dateKey = format(currentDate, 'yyyy-MM-dd');
    return todos.filter(todo => todo.date === dateKey);
  }, [todos, currentDate]);
  
  // 生成24小时时间段
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 无任务时间的任务
  const unscheduledTodos = dayTodos.filter(todo => !todo.time);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-center">
          {format(currentDate, 'yyyy年MM月dd日', { locale: zhCN })}
          <span className="ml-2 text-sm text-gray-500">
            {format(currentDate, 'EEEE', { locale: zhCN })}
          </span>
        </h2>
      </div>
      
      {unscheduledTodos.length > 0 && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">未安排时间的任务</h3>
          <div className="space-y-1">
            {unscheduledTodos.map(todo => (
              <div 
                key={todo.id}
                className={`text-sm py-1 px-2 rounded ${
                  todo.completed 
                    ? 'line-through bg-gray-100 text-gray-500' 
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {todo.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {hours.map(hour => (
          <HourRow key={hour} hour={hour} todos={dayTodos} />
        ))}
      </div>
    </div>
  );
};

export default DayView; 