import React from 'react';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Todo } from '@/types/todo';
import { useTodoStore } from '@/store/useTodoStore';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface TodoListProps {
  date?: Date;
  onEditTodo: (todo: Todo) => void;
}

const TodoItem: React.FC<{ 
  todo: Todo; 
  onToggle: () => void; 
  onEdit: () => void;
}> = ({ todo, onToggle, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "px-4 py-3 rounded-lg mb-2 border",
        todo.completed ? "bg-gray-100" : "bg-white",
        todo.priority === 'high' ? "border-l-4 border-l-danger" : 
        todo.priority === 'medium' ? "border-l-4 border-l-warning" : 
        "border-l-4 border-l-success"
      )}
      onClick={onEdit}
    >
      <div className="flex items-start">
        <button 
          className="mt-0.5 mr-3 text-lg flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {todo.completed ? (
            <FiCheckCircle className="text-success" />
          ) : (
            <FiCircle className="text-gray-400" />
          )}
        </button>
        
        <div className="flex-grow">
          <h3 className={cn(
            "font-medium text-base mb-1",
            todo.completed && "line-through text-gray-500"
          )}>
            {todo.title}
          </h3>
          
          <div className="flex text-xs text-gray-500 space-x-2">
            {todo.time && (
              <span className="flex items-center">
                <FiClock className="mr-1" />
                {todo.time}
              </span>
            )}
            
            {todo.repeat !== 'none' && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {todo.repeat === 'daily' ? '每天' : 
                 todo.repeat === 'weekly' ? '每周' : '每月'}
              </span>
            )}
          </div>
          
          {todo.note && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {todo.note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TodoList: React.FC<TodoListProps> = ({ date, onEditTodo }) => {
  const { todos, getTodosByDate, toggleCompleted } = useTodoStore();
  
  // 如果提供了特定日期，就获取那天的任务，否则获取所有任务
  const todosToDisplay = date
    ? getTodosByDate(date)
    : todos.sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // 如果日期相同，则按优先级排序
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  
  // 按照日期分组任务
  const todosByDate = todosToDisplay.reduce((groups, todo) => {
    const todoDate = parseISO(todo.date);
    const dateKey = format(todoDate, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(todo);
    return groups;
  }, {} as Record<string, Todo[]>);
  
  // 按日期提供标题
  const getDateHeading = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return '今天';
    } else if (isTomorrow(date)) {
      return '明天';
    } else if (isPast(date)) {
      return '已过期';
    } else {
      return format(date, 'MM月dd日 EEEE', { locale: zhCN });
    }
  };
  
  // 如果没有任务，显示空状态
  if (todosToDisplay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg 
          className="w-16 h-16 mb-4 text-gray-300"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <p>今天没有任务</p>
        <p className="text-sm">点击任意日期创建新任务</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 overflow-y-auto">
      {date ? (
        // 特定日期的任务列表
        <>
          {todosToDisplay.map((todo) => (
            <TodoItem 
              key={todo.id}
              todo={todo}
              onToggle={() => toggleCompleted(todo.id)}
              onEdit={() => onEditTodo(todo)}
            />
          ))}
        </>
      ) : (
        // 按日期分组的所有任务列表
        Object.entries(todosByDate).map(([dateKey, todos]) => (
          <div key={dateKey} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              {getDateHeading(dateKey)}
            </h2>
            
            {todos.map((todo) => (
              <TodoItem 
                key={todo.id}
                todo={todo}
                onToggle={() => toggleCompleted(todo.id)}
                onEdit={() => onEditTodo(todo)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default TodoList; 