'use client';

import { useState } from 'react';
import Calendar from './components/calendar/Calendar';
import TodoList from './components/todo/TodoList';
import TodoForm from './components/todo/TodoForm';
import { Todo } from '@/types/todo';
import { FiMenu, FiX } from 'react-icons/fi';

// 定义一些测试样式
const testStyles = {
  button: {
    backgroundColor: '#4F46E5', // 实际值而不是变量
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '10px',
    cursor: 'pointer',
    border: 'none'
  },
  header: {
    backgroundColor: '#F3F4F6', // 浅灰色背景
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB'
  }
};

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
    <main className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* 顶部测试区域 */}
      <div style={testStyles.header}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>日历任务管理系统</h1>
        <button style={testStyles.button}>测试按钮</button>
      </div>
      
      {/* 移动端菜单按钮 */}
      <button 
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          padding: '0.5rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          borderRadius: '9999px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        onClick={toggleSidebar}
      >
        {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* 日历区域 - 左侧/主区域 */}
      <div className="flex-grow h-full overflow-hidden">
        <Calendar onTodoClick={handleTodoClick} />
      </div>
      
      {/* 任务列表区域 - 右侧边栏 */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          backgroundColor: 'white',
          zIndex: 40,
          width: '20rem',
          transition: 'transform 0.3s ease-in-out',
          transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)',
          borderLeft: '1px solid #e5e7eb'
        }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>待办事项</h2>
        </div>
        
        <div style={{ height: 'calc(100% - 57px)', overflowY: 'auto' }}>
          <TodoList onEditTodo={handleTodoClick} />
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
