import React, { useEffect, useState, FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import '../app/globals.css';
import { useTodoStore, Todo } from '../store/useTodoStore-extension';

// 简化版弹出窗口组件
function PopupApp() {
  const { todos, loadTodos, addTodo, toggleCompleted, removeTodo } = useTodoStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTask, setNewTask] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // 在组件挂载时加载待办事项
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 处理提交新任务
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTodo({
      ...newTask,
      completed: false
    });

    setNewTask({
      title: '',
      date: selectedDate,
      priority: 'medium' as 'low' | 'medium' | 'high'
    });
    setShowAddForm(false);
  };

  // 获取当月的天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取当月第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 渲染日历
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 当月天数
    const daysInMonth = getDaysInMonth(year, month);
    // 当月第一天是星期几
    const firstDayOfWeek = getFirstDayOfMonth(year, month);
    
    // 日历行数
    const rows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);
    
    // 生成日历单元格
    const cells = [];
    let day = 1;
    
    // 渲染星期标题
    cells.push(
      <div key="weekdays" className="grid grid-cols-7 gap-1 mb-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(weekday => (
          <div key={weekday} className="text-center text-xs font-medium text-gray-600">
            {weekday}
          </div>
        ))}
      </div>
    );

    // 渲染日期
    for (let i = 0; i < rows; i++) {
      const rowCells = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || day > daysInMonth) {
          // 空白单元格
          rowCells.push(<div key={`empty-${i}-${j}`} className="h-7 w-7"></div>);
        } else {
          // 当前日期字符串
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          // 判断是否是当天
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          // 判断是否选中
          const isSelected = selectedDate === dateStr;
          // 判断是否有待办事项
          const hasTodos = todos.some(todo => todo.date === dateStr);
          
          rowCells.push(
            <div 
              key={`day-${day}`} 
              className={`h-7 w-7 text-center flex items-center justify-center text-xs cursor-pointer rounded-full
                ${isToday ? 'bg-blue-100' : ''}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${hasTodos ? 'font-bold' : ''}
                hover:bg-gray-100
              `}
              onClick={() => {
                setSelectedDate(dateStr);
                setNewTask({...newTask, date: dateStr});
              }}
            >
              {day}
              {hasTodos && <span className="absolute w-1 h-1 bg-blue-500 rounded-full bottom-0.5"></span>}
            </div>
          );
          day++;
        }
      }
      cells.push(
        <div key={`row-${i}`} className="grid grid-cols-7 gap-1 relative">
          {rowCells}
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow p-3 mb-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">
            {year}年{month + 1}月
          </h2>
          <div className="flex space-x-1">
            <button 
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="text-xs px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200"
            >
              上月
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="text-xs px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200"
            >
              下月
            </button>
          </div>
        </div>
        <div>{cells}</div>
      </div>
    );
  };

  // 过滤显示当天任务
  const filteredTodos = todos.filter(todo => 
    showCalendar ? todo.date === selectedDate : true
  );

  return (
    <div className="flex flex-col h-[500px] w-[350px] bg-gray-50 p-2 overflow-hidden">
      <h1 className="text-lg font-bold text-center text-blue-600 mb-2">
        日历待办事项
      </h1>
      
      {!showAddForm ? (
        <>
          <div className="flex justify-end mb-2 space-x-2">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
            >
              {showCalendar ? '隐藏日历' : '显示日历'}
            </button>
            <button 
              onClick={() => setShowAddForm(true)}
              className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
            >
              + 添加任务
            </button>
          </div>

          {showCalendar && renderCalendar()}
          
          <div className="bg-white rounded-lg shadow p-3 mb-2 overflow-auto flex-1">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold">
                {showCalendar ? `${selectedDate} 的待办事项` : '所有待办事项'}
              </h2>
            </div>
            
            {filteredTodos.length === 0 ? (
              <p className="text-gray-500 text-sm">当前没有待办事项</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {filteredTodos.map(todo => (
                  <li key={todo.id} className="border-l-4 pl-2 py-1 flex justify-between" style={{ borderColor: getPriorityColor(todo.priority) }}>
                    <div>
                      <span 
                        className={todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                        onClick={() => toggleCompleted(todo.id)}
                      >
                        {todo.title}
                      </span>
                      <div className="text-xs text-gray-500">
                        {todo.date} {todo.time && `${todo.time}`}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => toggleCompleted(todo.id)}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          todo.completed 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-green-100 text-green-600'
                        }`}
                      >
                        {todo.completed ? '取消' : '完成'}
                      </button>
                      <button 
                        onClick={() => removeTodo(todo.id)}
                        className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded"
                      >
                        删除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-3 mb-2 overflow-auto flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md font-semibold">添加新任务</h2>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-3 flex-1">
              <div>
                <label className="block text-sm text-gray-700 mb-1">标题</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-2 py-1 text-sm border rounded"
                  placeholder="任务标题"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">日期</label>
                <input 
                  type="date" 
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="w-full px-2 py-1 text-sm border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">优先级</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 pt-2 border-t">
              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-3 rounded-md text-sm font-bold flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                保存任务
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mt-1 text-center">
        <button 
          onClick={() => chrome.tabs.create({ url: 'index.html' })}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          打开完整日历应用
        </button>
      </div>
    </div>
  );
}

// 简单的辅助函数
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}

// 渲染弹出窗口
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<PopupApp />);
}

// 动态加载CSS
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'tailwind-output.css';
document.head.appendChild(link); 