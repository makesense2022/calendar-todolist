import React, { useMemo } from 'react';
import { format, isToday, parseISO, isAfter, isBefore, isSameDay } from 'date-fns';
import { FiCheck, FiCircle, FiCalendar, FiClock, FiList } from 'react-icons/fi';
import { useTodoStore } from '@/store/useTodoStore';

interface TodoListProps {
  onTodoClick: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onTodoClick }) => {
  const { todos, toggleTodoCompletion } = useTodoStore();

  const { todayTodos, upcomingTodos, pastTodos } = useMemo(() => {
    const today = new Date();
    
    const todayItems = todos.filter(todo => {
      const todoDate = parseISO(todo.date);
      return isToday(todoDate);
    });
    
    const upcomingItems = todos.filter(todo => {
      const todoDate = parseISO(todo.date);
      return isAfter(todoDate, today) && !isToday(todoDate);
    });
    
    const pastItems = todos.filter(todo => {
      const todoDate = parseISO(todo.date);
      return isBefore(todoDate, today) && !isToday(todoDate);
    });
    
    return {
      todayTodos: todayItems,
      upcomingTodos: upcomingItems,
      pastTodos: pastItems,
    };
  }, [todos]);

  const handleToggleComplete = (e: React.MouseEvent, todoId: string) => {
    e.stopPropagation();
    toggleTodoCompletion(todoId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-400';
      case 'medium':
        return 'from-yellow-500 to-amber-400';
      case 'low':
        return 'from-green-500 to-emerald-400';
      default:
        return 'from-gray-500 to-gray-400';
    }
  };

  const renderTodoItem = (todo: any) => (
    <div
      key={todo.id}
      className={`tech-task ${todo.completed ? 'completed' : ''} mb-2`}
      onClick={() => onTodoClick(todo.id)}
      style={{
        borderLeftColor: todo.completed ? 'var(--success)' : 
                         todo.priority === 'high' ? 'var(--danger)' : 
                         todo.priority === 'medium' ? 'var(--warning)' : 'var(--success)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={(e) => handleToggleComplete(e, todo.id)}
            className={`p-1 rounded-full transition-all duration-200 ${
              todo.completed ? 'bg-green-100' : 'hover:bg-gray-100'
            }`}
          >
            {todo.completed ? (
              <FiCheck className="text-green-500" size={18} />
            ) : (
              <FiCircle className="text-gray-400" size={18} />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)} mr-2`}></span>
              <span className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </span>
            </div>
            <div className="flex text-xs text-gray-500 mt-1 items-center">
              <FiCalendar className="mr-1" size={12} />
              <span className="mr-2">{format(parseISO(todo.date), 'MM/dd')}</span>
              {todo.time && (
                <>
                  <FiClock className="mr-1" size={12} />
                  <span>{todo.time}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-t-lg">
        <h2 className="text-lg font-semibold flex items-center">
          <FiList className="mr-2" />
          任务列表
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiList size={48} className="mb-4 text-gray-300" />
            <p>没有任务，请创建新任务</p>
          </div>
        ) : (
          <>
            {todayTodos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md">
                  今天
                </h3>
                <div className="space-y-1">
                  {todayTodos.map(renderTodoItem)}
                </div>
              </div>
            )}
            
            {upcomingTodos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-3 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md">
                  即将到来
                </h3>
                <div className="space-y-1">
                  {upcomingTodos.map(renderTodoItem)}
                </div>
              </div>
            )}
            
            {pastTodos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3 px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-md">
                  历史任务
                </h3>
                <div className="space-y-1">
                  {pastTodos.map(renderTodoItem)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoList; 