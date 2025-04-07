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

// 定义内联样式对象
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center' as const,
    padding: '0.5rem 0',
    fontWeight: 500,
    color: '#6B7280'
  },
  weekDay: {
    fontSize: '0.875rem'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    flexGrow: 1
  },
  calendarCell: {
    aspectRatio: '1/1',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #e5e7eb'
  },
  calendarCellOutsideMonth: {
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    color: '#9CA3AF'
  },
  calendarCellToday: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)'
  },
  dayCircle: {
    height: '2rem',
    width: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    marginBottom: '0.25rem'
  },
  todayCircle: {
    backgroundColor: '#4F46E5',
    color: 'white'
  },
  taskDotsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginTop: '0.25rem',
    maxWidth: '70%'
  },
  taskDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    margin: '1px'
  },
  dotHigh: {
    backgroundColor: '#EF4444'
  },
  dotMedium: {
    backgroundColor: '#F59E0B'
  },
  dotLow: {
    backgroundColor: '#10B981'
  },
  moreTasksLabel: {
    fontSize: '0.75rem',
    color: '#6B7280',
    marginLeft: '0.25rem'
  }
};

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
  
  // 合并单元格样式
  const cellStyle = {
    ...styles.calendarCell,
    ...(isCurrentMonth ? {} : styles.calendarCellOutsideMonth),
    ...(isCurrentDay ? styles.calendarCellToday : {})
  };
  
  // 合并日期圆圈样式
  const dayCircleStyle = {
    ...styles.dayCircle,
    ...(isCurrentDay ? styles.todayCircle : {})
  };
  
  // 渲染任务点
  const renderTaskDots = () => {
    return todos.slice(0, 3).map((todo, index) => {
      let dotStyle = { ...styles.taskDot };
      
      if (todo.priority === 'high') {
        dotStyle = { ...dotStyle, ...styles.dotHigh };
      } else if (todo.priority === 'medium') {
        dotStyle = { ...dotStyle, ...styles.dotMedium };
      } else {
        dotStyle = { ...dotStyle, ...styles.dotLow };
      }
      
      return <div key={todo.id} style={dotStyle} />;
    });
  };
  
  // 如果有更多任务，显示一个加号指示器
  const hasMoreTasks = todos.length > 3;
  
  return (
    <div 
      style={cellStyle}
      onClick={() => onDayClick(date)}
    >
      <div style={dayCircleStyle}>
        {dayNumber}
      </div>
      
      {todos.length > 0 && (
        <div style={styles.taskDotsContainer}>
          {renderTaskDots()}
          {hasMoreTasks && (
            <span style={styles.moreTasksLabel}>+{todos.length - 3}</span>
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
  
  // 一周中的每一天
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  useEffect(() => {
    // 当前月份的开始和结束
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    
    // 日历视图的开始和结束（包括上月和下月的部分日期）
    const calendarStart = startOfWeek(monthStart, { locale: zhCN });
    const calendarEnd = endOfWeek(monthEnd, { locale: zhCN });
    
    // 生成日历网格的日期数组
    const daysInMonth = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
    
    setDays(daysInMonth);
  }, [currentDate]);
  
  return (
    <div style={styles.container}>
      {/* 星期标题行 */}
      <div style={styles.weekHeader}>
        {weekDays.map((day) => (
          <div key={day} style={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期网格 */}
      <motion.div 
        style={styles.calendarGrid}
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