import React, { useMemo } from 'react';
import { format, isToday, parseISO, isAfter, isSameDay } from 'date-fns';
import { FiCheck, FiCircle } from 'react-icons/fi';
import { useTodoStore } from '@/store/useTodoStore';

interface TodoListProps {
  onTodoClick: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onTodoClick }) => {
  const { todos, toggleTodoCompletion } = useTodoStore();

  const { todayTodos, upcomingTodos } = useMemo(() => {
    const today = new Date();
    
    const todayItems = todos.filter(todo => {
      const todoDate = parseISO(todo.date);
      return isToday(todoDate);
    });
    
    const upcomingItems = todos.filter(todo => {
      const todoDate = parseISO(todo.date);
      return isAfter(todoDate, today) && !isToday(todoDate);
    });
    
    return {
      todayTodos: todayItems,
      upcomingTodos: upcomingItems,
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

  const renderTodoItem = (todo: any) => (
    <div
      key={todo.id}
      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={() => onTodoClick(todo.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={(e) => handleToggleComplete(e, todo.id)}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {todo.completed ? (
              <FiCheck className="text-green-500" size={18} />
            ) : (
              <FiCircle className="text-gray-400" size={18} />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`}></span>
              <span className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </span>
            </div>
            {todo.time && (
              <div className="text-xs text-gray-500 mt-1">
                {todo.time}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-3">任务列表</h2>
      
      <div className="flex-1 overflow-auto">
        {todos.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            没有任务，请创建新任务
          </div>
        ) : (
          <>
            {todayTodos.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">今天</h3>
                <div className="bg-white rounded-md">
                  {todayTodos.map(renderTodoItem)}
                </div>
              </div>
            )}
            
            {upcomingTodos.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">即将到来</h3>
                <div className="bg-white rounded-md">
                  {upcomingTodos.map(renderTodoItem)}
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