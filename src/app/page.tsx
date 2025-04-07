'use client';

import { useState } from 'react';
import Calendar from './components/calendar/Calendar';
import TodoList from './components/todo/TodoList';
import TodoForm from './components/todo/TodoForm';
import { Todo } from '@/types/todo';
import { FiMenu, FiX, FiCalendar } from 'react-icons/fi';

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTodo(undefined);
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white py-3 px-4 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <button className="mr-2 text-gray-700">
            <FiMenu size={22} />
          </button>
          <div className="flex items-center">
            <FiCalendar className="w-5 h-5 text-gray-700 mr-2" />
            <h1 className="text-lg font-bold text-gray-800">日历任务管理系统</h1>
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 flex items-center">
            <FiCalendar className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold">日历</h2>
          </div>
          <div className="border-t border-gray-200 py-2">
            <div className="px-3 py-2 text-indigo-600 bg-indigo-50 font-medium flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
              待办事项
            </div>
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {/* 日历区域 */}
          <div className="flex-grow h-full overflow-hidden">
            <Calendar onTodoClick={handleTodoClick} />
          </div>
          
          {/* 右侧任务列表按钮 (移动端) */}
          <button 
            className="fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
            onClick={toggleSidebar}
          >
            {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          {/* 任务列表区域 - 右侧边栏 */}
          <div 
            className={`fixed lg:static top-0 right-0 h-full bg-white z-40 w-80 transition-transform duration-300
              ${showSidebar ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              shadow-lg lg:shadow-none border-l border-gray-200`}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">待办事项</h2>
            </div>
            
            <div className="h-[calc(100%-57px)] overflow-y-auto">
              <TodoList onEditTodo={handleTodoClick} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 编辑任务表单 */}
      {showForm && (
        <TodoForm
          todoToEdit={selectedTodo}
          onClose={handleFormClose}
        />
      )}
    </main>
  );
}
