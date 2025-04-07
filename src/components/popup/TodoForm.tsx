import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useTodoStore } from '../../store/useTodoStore-extension';

interface TodoFormProps {
  initialDate?: Date;
  todoId?: string | null;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialDate, todoId, onClose }) => {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: '',
    priority: 'medium',
    repeat: 'none',
    completed: false
  });
  
  // 如果提供了todoId，加载对应的待办事项数据
  useEffect(() => {
    if (todoId) {
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        setFormData({
          title: todo.title,
          description: todo.description || '',
          date: todo.date,
          time: todo.time || '',
          priority: todo.priority,
          repeat: todo.repeat,
          completed: todo.completed
        });
      }
    }
  }, [todoId, todos]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (todoId) {
      updateTodo(todoId, {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time || undefined,
        priority: formData.priority as 'high' | 'medium' | 'low',
        repeat: formData.repeat as 'none' | 'daily' | 'weekly' | 'monthly',
        completed: formData.completed
      });
    } else {
      addTodo({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time || undefined,
        priority: formData.priority as 'high' | 'medium' | 'low',
        repeat: formData.repeat as 'none' | 'daily' | 'weekly' | 'monthly',
        completed: formData.completed
      });
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (todoId) {
      deleteTodo(todoId);
      onClose();
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {todoId ? '编辑待办事项' : '新建待办事项'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              时间
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重复
            </label>
            <select
              name="repeat"
              value={formData.repeat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="none">不重复</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          {todoId && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              删除
            </button>
          )}
          
          <div className="ml-auto space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoForm; 