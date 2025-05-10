'use client';

import React, { useState } from 'react';
import Calendar from '../components/calendar/Calendar';
import TodoList from '../components/todo/TodoList';
import TodoForm from '../components/todo/TodoForm';
import { useTodoStore } from '@/store/useTodoStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function Home() {
  const { todos } = useTodoStore();
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialFormDate, setInitialFormDate] = useState<Date>(new Date());
  
  const formattedDate = format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN });
  
  const todoToEdit = selectedTodoId ? todos.find(todo => todo.id === selectedTodoId) : undefined;

  const handleNewTask = (date: Date) => {
    setSelectedTodoId(null);
    setInitialFormDate(date);
    setIsFormOpen(true);
  };

  const handleEditTask = (todoId: string) => {
    setSelectedTodoId(todoId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTodoId(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex flex-1 overflow-hidden p-4">
        <div className="flex-1 overflow-hidden rounded-lg shadow-lg mr-4">
          <Calendar onDayClick={handleNewTask} />
        </div>
        <div className="w-96 flex flex-col rounded-lg shadow-lg overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <TodoList onTodoClick={handleEditTask} />
          </div>
        </div>
        {isFormOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <TodoForm 
                todoToEdit={todoToEdit}
                initialDate={initialFormDate}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
