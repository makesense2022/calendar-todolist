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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {todoToEdit ? '编辑任务' : '新建任务'}
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600" 
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('time')}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="low"
                  className="mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-success mr-1"></span>
                低
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="medium"
                  className="mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-warning mr-1"></span>
                中
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="high"
                  className="mr-2"
                  {...register('priority')}
                />
                <span className="inline-block w-3 h-3 rounded-full bg-danger mr-1"></span>
                高
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重复
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="添加备注..."
              {...register('note')}
            ></textarea>
          </div>
          
          <div className="flex justify-between pt-4">
            {todoToEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center"
              >
                <FiTrash className="mr-1" />
                删除
              </Button>
            )}
            
            <div className={`flex space-x-3 ${todoToEdit ? '' : 'ml-auto'}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                取消
              </Button>
              <Button type="submit">
                {todoToEdit ? '保存' : '创建'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm; 