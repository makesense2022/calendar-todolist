import React from 'react';
import { 
  format, 
  isToday,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameHour,
  parseISO,
  getHours,
  isSameDay
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTodoStore } from '@/store/useTodoStore';
import { useDateStore } from '@/store/useDateStore';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';

interface DayViewProps {
  onTimeClick: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ onTimeClick }) => {
  const { todos } = useTodoStore();
  const { currentDate } = useDateStore();
  
  // 一天中的时间段（每小时）
  const dayHours = eachHourOfInterval({ 
    start: startOfDay(currentDate),
    end: endOfDay(currentDate)
  });
  
  // 获取当天的任务
  const getTodosByDate = (date: Date) => {
    return todos.filter(todo => {
      if (!todo.date) return false;
      return isSameDay(parseISO(todo.date), date);
    });
  };
  
  // 获取某一小时的任务
  const getHourTodos = (hour: Date) => {
    const dayTodos = getTodosByDate(currentDate);
    
    return dayTodos.filter(todo => {
      if (!todo.time) return false;
      
      const [todoHour] = todo.time.split(':').map(Number);
      return todoHour === getHours(hour);
    });
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 日期标题 */}
      <div className="border-b py-4 text-center">
        <div className={`text-lg font-medium ${isToday(currentDate) ? 'text-primary' : ''}`}>
          {format(currentDate, 'yyyy年MM月dd日', { locale: zhCN })}
          {isToday(currentDate) && <span className="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded-full">今天</span>}
        </div>
        <div className="text-sm text-gray-500">
          {format(currentDate, 'EEEE', { locale: zhCN })}
        </div>
      </div>
      
      {/* 时间网格 */}
      <motion.div 
        className="flex-grow overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-1 h-auto">
          {dayHours.map((hour) => {
            const hourTodos = getHourTodos(hour);
            const isCurrentHour = isToday(currentDate) && isSameHour(new Date(), hour);
            
            return (
              <div 
                key={hour.toString()} 
                className={`border-b relative group ${
                  isCurrentHour ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  const selectedDate = new Date(currentDate);
                  selectedDate.setHours(hour.getHours(), 0, 0, 0);
                  onTimeClick(selectedDate);
                }}
              >
                <div className="flex">
                  <div className="w-20 p-2 border-r">
                    <div className="text-sm text-gray-500 text-center">
                      {format(hour, 'HH:mm')}
                    </div>
                  </div>
                  
                  <div className="flex-grow min-h-[100px] relative p-2">
                    {hourTodos.map((todo) => (
                      <div 
                        key={todo.id}
                        className={`
                          my-1 p-2 rounded text-sm
                          ${todo.priority === 'high' 
                            ? 'bg-red-100 border-l-4 border-red-500' 
                            : todo.priority === 'medium'
                              ? 'bg-amber-100 border-l-4 border-amber-500'
                              : 'bg-green-100 border-l-4 border-green-500'
                          }
                          ${todo.completed ? 'opacity-60 line-through' : ''}
                        `}
                      >
                        <div className="font-medium">{todo.title}</div>
                        {todo.note && <div className="text-xs text-gray-600 mt-1">{todo.note}</div>}
                      </div>
                    ))}
                    
                    {/* 添加任务的悬浮按钮 */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          const selectedDate = new Date(currentDate);
                          selectedDate.setHours(hour.getHours(), 0, 0, 0);
                          onTimeClick(selectedDate);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DayView; 