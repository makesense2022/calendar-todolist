import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Todo, Priority, RepeatType } from '@/types/todo';
import { useTodoStore } from '@/store/useTodoStore';
import { Button } from '../Button';
import { FiX, FiTrash } from 'react-icons/fi';

interface TodoFormProps {
  initialDate?: Date;
  todoToEdit?: Todo;
  onClose: () => void;
}

type FormData = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

const TodoForm: React.FC<TodoFormProps> = ({ initialDate, todoToEdit, onClose }) => {
  const { addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: todoToEdit
      ? { ...todoToEdit }
      : {
          title: '',
          date: initialDate ? format(initialDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          time: initialDate?.getHours() ? `${initialDate.getHours()}:00` : undefined,
          priority: 'medium' as Priority,
          note: '',
          completed: false,
          repeat: 'none' as RepeatType,
          reminder: undefined,
        },
  });
  
  const onSubmit = (data: FormData) => {
    if (todoToEdit) {
      updateTodo(todoToEdit.id, data);
    } else {
      addTodo(data);
    }
    onClose();
  };
  
  const handleDelete = () => {
    if (todoToEdit) {
      deleteTodo(todoToEdit.id);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-y-auto relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {todoToEdit ? '编辑任务' : '新建任务'}
          </h2>
          <button 
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100" 
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="请输入任务标题"
              {...register('title', { required: '请输入任务标题' })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日期 <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setSelectedDate(date);
                        field.onChange(format(date, 'yyyy-MM-dd'));
                      }
                    }}
                    dateFormat="yyyy/MM/dd"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    wrapperClassName="w-full"
                  />
                )}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                时间
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                {...register('time')}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="low"
                  className="w-4 h-4 text-indigo-600 mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                低
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="medium"
                  className="w-4 h-4 text-indigo-600 mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                中
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="high"
                  className="w-4 h-4 text-indigo-600 mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                高
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重复
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              {...register('repeat')}
            >
              <option value="none">不重复</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] resize-none"
              placeholder="添加备注..."
              {...register('note')}
            ></textarea>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
            {todoToEdit ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center"
              >
                <FiTrash className="mr-1" />
                删除
              </Button>
            ) : (
              <div></div>
            )}
            
            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                {todoToEdit ? '保存' : '创建'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm; 