'use client';

import { useState } from 'react';
import Calendar from '@/components/calendar/Calendar';
import TodoList from '@/components/todo/TodoList';
import TodoForm from '@/components/todo/TodoForm';
import { useTodoStore } from '@/store/useTodoStore';

export default function Home() {
  const { selectedTodoId, setSelectedTodoId, isFormOpen, setIsFormOpen, todos } = useTodoStore();
  const [initialFormDate, setInitialFormDate] = useState<Date | undefined>(undefined);

  const handleNewTask = (date?: Date) => {
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
    setInitialFormDate(undefined);
  };

  const todoToEdit = selectedTodoId 
    ? todos.find(todo => todo.id === selectedTodoId) 
    : undefined;

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">日历任务清单</h1>
      </header>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
          <Calendar onDayClick={handleNewTask} />
        </div>
        
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex-1">
            <TodoList onTodoClick={handleEditTask} />
          </div>
        </div>
      </div>
      
      {isFormOpen && (
        <TodoForm 
          todoToEdit={todoToEdit}
          initialDate={initialFormDate}
          onClose={handleCloseForm}
        />
      )}
    </main>
  );
}
