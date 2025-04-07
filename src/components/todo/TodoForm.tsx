import React, { useState } from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Todo, Priority, RepeatType } from '@/types/todo';
import { useTodoStore } from '@/store/useTodoStore';
import { FiX, FiTrash, FiCalendar, FiClock, FiRepeat, FiFlag, FiFileText } from 'react-icons/fi';

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white">
            <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {todoToEdit ? '编辑任务' : '新建任务'}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="请输入任务标题"
                  {...register('title', { required: '请输入任务标题' })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiCalendar className="mr-1" size={16} />
                    日期 <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="mt-1">
                    <Controller
                      control={control}
                      name="date"
                      render={({ field }: { field: ControllerRenderProps<FormData, 'date'> }) => (
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date: Date | null) => {
                            if (date) {
                              setSelectedDate(date);
                              field.onChange(format(date, 'yyyy-MM-dd'));
                            }
                          }}
                          dateFormat="yyyy/MM/dd"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <FiClock className="mr-1" size={16} />
                    时间
                  </label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    {...register('time')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiFlag className="mr-1" size={16} />
                  优先级
                </label>
                <div className="mt-2 flex space-x-3">
                  <label className="flex items-center p-2 border border-gray-200 rounded-md flex-1 justify-center">
                    <input
                      type="radio"
                      value="low"
                      className="mr-2"
                      {...register('priority')}
                    />
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    <span className="text-sm">低</span>
                  </label>
                  <label className="flex items-center p-2 border border-gray-200 rounded-md flex-1 justify-center">
                    <input
                      type="radio"
                      value="medium"
                      className="mr-2"
                      {...register('priority')}
                    />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    <span className="text-sm">中</span>
                  </label>
                  <label className="flex items-center p-2 border border-gray-200 rounded-md flex-1 justify-center">
                    <input
                      type="radio"
                      value="high"
                      className="mr-2"
                      {...register('priority')}
                    />
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-sm">高</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiRepeat className="mr-1" size={16} />
                  重复
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  {...register('repeat')}
                >
                  <option value="none">不重复</option>
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <FiFileText className="mr-1" size={16} />
                  备注
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border resize-none"
                  placeholder="添加备注..."
                  {...register('note')}
                ></textarea>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                {todoToEdit ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none"
                  >
                    <FiTrash className="mr-2 h-5 w-5" />
                    删除
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    onClick={onClose}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
                  >
                    {todoToEdit ? '保存' : '创建'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoForm; 