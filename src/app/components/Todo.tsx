import React, { useState } from 'react';
import { Todo as TodoType } from '@/types/todo';
import { useTodoStore } from '@/store/useTodoStore';
import { format } from 'date-fns';
import { FiPlus, FiClock, FiCalendar, FiCheck } from 'react-icons/fi';
import TodoForm from './todo/TodoForm';

interface TodoProps {
  className?: string;
  onClose?: () => void;
}

const Todo: React.FC<TodoProps> = ({ className, onClose }) => {
  const { todos, toggleTodoCompletion } = useTodoStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoType | undefined>(undefined);

  // 获取今天的待办事项
  const todayTodos = todos.filter(todo => {
    if (!todo.date) return false;
    const todoDate = new Date(todo.date);
    const today = new Date();
    return (
      todoDate.getDate() === today.getDate() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getFullYear() === today.getFullYear()
    );
  });

  // 获取未来的待办事项
  const upcomingTodos = todos.filter(todo => {
    if (!todo.date) return false;
    const todoDate = new Date(todo.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todoDate > today && !todayTodos.includes(todo);
  });

  const handleAddNewTask = () => {
    setSelectedTodo(undefined);
    setShowForm(true);
  };

  const handleEditTodo = (todo: TodoType) => {
    setSelectedTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTodo(undefined);
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

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">待办事项</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <span className="mr-1 w-1 h-4 bg-indigo-500 rounded-full"></span>
            今日任务
          </h3>
          {todayTodos.length > 0 ? (
            <div className="space-y-2">
              {todayTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => handleEditTodo(todo)}
                >
                  <div className="flex items-start">
                    <button
                      className={`mt-1 w-5 h-5 rounded-full border flex-shrink-0 transition-colors ${
                        todo.completed 
                          ? 'bg-indigo-500 border-indigo-500 flex items-center justify-center' 
                          : 'border-gray-300 hover:border-indigo-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTodoCompletion(todo.id);
                      }}
                    >
                      {todo.completed && <FiCheck className="text-white" size={12} />}
                    </button>
                    <div className="ml-3 flex-1">
                      <p className={`font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {todo.title}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                        {todo.time && (
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={14} />
                            <span>{todo.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span 
                      className={`w-2 h-2 rounded-full ml-2 mt-2 ${getPriorityColor(todo.priority)}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p>今天没有任务</p>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <span className="mr-1 w-1 h-4 bg-blue-400 rounded-full"></span>
            即将到来
          </h3>
          {upcomingTodos.length > 0 ? (
            <div className="space-y-2">
              {upcomingTodos.map(todo => (
                <div 
                  key={todo.id} 
                  className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                  onClick={() => handleEditTodo(todo)}
                >
                  <div className="flex items-start">
                    <button
                      className={`mt-1 w-5 h-5 rounded-full border flex-shrink-0 transition-colors ${
                        todo.completed 
                          ? 'bg-indigo-500 border-indigo-500 flex items-center justify-center' 
                          : 'border-gray-300 hover:border-indigo-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTodoCompletion(todo.id);
                      }}
                    >
                      {todo.completed && <FiCheck className="text-white" size={12} />}
                    </button>
                    <div className="ml-3 flex-1">
                      <p className={`font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {todo.title}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" size={14} />
                          <span>{format(new Date(todo.date), 'MM/dd')}</span>
                        </div>
                        {todo.time && (
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={14} />
                            <span>{todo.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span 
                      className={`w-2 h-2 rounded-full ml-2 mt-2 ${getPriorityColor(todo.priority)}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
              <p>没有即将到来的任务</p>
            </div>
          )}
        </section>
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <button 
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
          onClick={handleAddNewTask}
        >
          <FiPlus className="mr-2" />
          新建任务
        </button>
      </div>

      {showForm && (
        <TodoForm 
          initialDate={undefined}
          todoToEdit={selectedTodo}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Todo;
