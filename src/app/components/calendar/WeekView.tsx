import React from 'react';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isToday,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  isSameHour,
  isSameDay,
  parseISO,
  getHours
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTodoStore } from '@/store/useTodoStore';
import { motion } from 'framer-motion';
import { Todo } from '@/types/todo';

interface WeekViewProps {
  onDayClick: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onDayClick }) => {
  const { currentDate, getTodosByDate } = useTodoStore();
  
  // 当前周的开始和结束
  const weekStart = startOfWeek(currentDate, { locale: zhCN });
  const weekEnd = endOfWeek(currentDate, { locale: zhCN });
  
  // 一周中的每一天
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // 一天中的时间段（每小时）
  const dayHours = eachHourOfInterval({ 
    start: startOfDay(currentDate),
    end: endOfDay(currentDate)
  }).filter(hour => getHours(hour) >= 7 && getHours(hour) <= 22); // 只显示7点到22点
  
  // 获取某一天某一小时的任务
  const getHourTodos = (day: Date, hour: Date) => {
    const dayTodos = getTodosByDate(day);
    
    return dayTodos.filter(todo => {
      if (!todo.time) return false;
      
      const [todoHour] = todo.time.split(':').map(Number);
      return todoHour === getHours(hour);
    });
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 星期标题行 */}
      <div className="grid grid-cols-8 border-b py-2">
        <div className="text-center text-gray-500 text-sm"></div>
        {weekDays.map((day) => (
          <div 
            key={day.toString()} 
            className={`text-center cursor-pointer ${isToday(day) ? 'text-primary font-bold' : ''}`}
            onClick={() => onDayClick(day)}
          >
            <div className="text-sm font-medium">
              {format(day, 'E', { locale: zhCN })}
            </div>
            <div className={`
              h-8 w-8 flex items-center justify-center rounded-full mx-auto
              ${isToday(day) ? 'bg-primary text-white' : ''}
            `}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      {/* 时间网格 */}
      <motion.div 
        className="flex-grow overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="grid grid-cols-8 h-[1600px]">
          {/* 时间列 */}
          <div className="border-r">
            {dayHours.map((hour) => (
              <div key={hour.toString()} className="h-20 border-b">
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {format(hour, 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
          
          {/* 每天的时间单元格 */}
          {weekDays.map((day) => (
            <div key={day.toString()} className="border-r">
              {dayHours.map((hour) => {
                const hourTodos = getHourTodos(day, hour);
                const isCurrentHour = isToday(day) && isSameHour(new Date(), hour);
                
                return (
                  <div 
                    key={hour.toString()} 
                    className={`h-20 border-b relative group ${
                      isCurrentHour ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      const selectedDate = new Date(day);
                      selectedDate.setHours(hour.getHours(), 0, 0, 0);
                      onDayClick(selectedDate);
                    }}
                  >
                    {hourTodos.map((todo) => (
                      <div 
                        key={todo.id}
                        className={`
                          mx-1 my-0.5 p-1 rounded text-xs truncate cursor-pointer
                          ${todo.priority === 'high' 
                            ? 'bg-red-100 border-l-4 border-red-500' 
                            : todo.priority === 'medium'
                              ? 'bg-amber-100 border-l-4 border-amber-500'
                              : 'bg-green-100 border-l-4 border-green-500'
                          }
                          ${todo.completed ? 'opacity-60 line-through' : ''}
                        `}
                      >
                        {todo.title}
                      </div>
                    ))}
                    
                    {/* 添加任务的悬浮按钮（在每个单元格的右下角） */}
                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          const selectedDate = new Date(day);
                          selectedDate.setHours(hour.getHours(), 0, 0, 0);
                          onDayClick(selectedDate);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WeekView; 