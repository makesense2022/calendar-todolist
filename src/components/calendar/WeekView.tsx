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
    <div className="time-slot h-14">
      {/* 时间标签放在左侧并居中 */}
      <div className="time-label absolute left-0 top-0 w-12 h-full flex items-center justify-end">
        {hour}:00
      </div>
      <div className="ml-12 h-full pl-3 flex items-center">
        {hourTodos.map(todo => (
          <div 
            key={todo.id}
            className={`tech-task text-xs ${todo.completed ? 'completed' : ''} my-0 py-1`}
            style={{
              borderLeftColor: todo.completed ? 'var(--success)' : 
                              todo.priority === 'high' ? 'var(--danger)' : 
                              todo.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
            }}
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
  // 确保小时从0开始到23
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 min-w-0 border-r border-gray-200">
      <div 
        className={`text-center py-2 font-medium text-sm ${
          isCurrentDay 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            : 'bg-gray-50'
        }`}
        onClick={() => onClick(date)}
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
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg">
        <div className="w-12 flex-shrink-0 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
          {/* 空白区域用于时间标签列的标题部分 */}
          <div className="h-[52px] border-b border-gray-200"></div>
          {/* 此处不需要内容 */}
        </div>
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