import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isToday,
  isSameMonth,
  parseISO
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useDateStore } from '@/store/useDateStore';
import { useTodoStore } from '@/store/useTodoStore';

interface WeekViewProps {
  onDayClick: (date: Date) => void;
}

interface DayProps {
  date: Date;
  todos: any[];
  onClick: (date: Date) => void;
}

const HourCell: React.FC<{ hour: number, date: Date, todos: any[] }> = ({ hour, date, todos }) => {
  // 过滤出该小时的任务
  const hourTodos = todos.filter(todo => {
    if (!todo.time) return false;
    const [todoHour] = todo.time.split(':').map(Number);
    return todoHour === hour;
  });

  return (
    <div className="h-12 border-b border-gray-200 relative">
      <div className="absolute left-0 -mt-3 w-12 text-xs text-gray-500 text-right pr-2">
        {hour}:00
      </div>
      <div className="ml-12 h-full">
        {hourTodos.map(todo => (
          <div 
            key={todo.id}
            className={`text-xs py-1 px-2 mb-1 rounded ${
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
  );
};

const Day: React.FC<DayProps> = ({ date, todos, onClick }) => {
  const isCurrentDay = isToday(date);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 min-w-0">
      <div 
        className={`text-center py-2 font-medium text-sm border-b ${
          isCurrentDay ? 'bg-blue-100 text-blue-800' : 'bg-gray-50'
        }`}
      >
        {format(date, 'E', { locale: zhCN })}
        <div className="text-xs">
          {format(date, 'MM/dd')}
        </div>
      </div>
      <div className="overflow-y-auto" style={{ height: 'calc(100% - 52px)' }}>
        {hours.map(hour => (
          <HourCell key={hour} hour={hour} date={date} todos={todos} />
        ))}
      </div>
    </div>
  );
};

const WeekView: React.FC<WeekViewProps> = ({ onDayClick }) => {
  const { currentDate } = useDateStore();
  const { todos } = useTodoStore();

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // 从周一开始
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);
  
  // 按日期分组任务
  const todosByDate = useMemo(() => {
    const result: { [key: string]: any[] } = {};
    
    weekDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      result[dateKey] = [];
    });
    
    todos.forEach(todo => {
      if (result[todo.date]) {
        result[todo.date].push(todo);
      }
    });
    
    return result;
  }, [todos, weekDays]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {weekDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <Day
              key={dateKey}
              date={day}
              todos={todosByDate[dateKey] || []}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeekView; 