import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import TodoForm from '../todo/TodoForm';
import { useViewStore } from '@/store/useViewStore';
import { Todo } from '@/types/todo';
import { AnimatePresence } from 'framer-motion';

interface CalendarProps {
  onTodoClick?: (todo: Todo) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onTodoClick }) => {
  const { view } = useViewStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [todoToEdit, setTodoToEdit] = useState<Todo | undefined>(undefined);
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setTodoToEdit(undefined);
    setShowForm(true);
  };
  
  const handleTodoEdit = (todo: Todo) => {
    setTodoToEdit(todo);
    setShowForm(true);
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDate(undefined);
    setTodoToEdit(undefined);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <CalendarHeader />
      
      <div className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'month' && (
            <MonthView 
              onDayClick={handleDayClick} 
              key="month-view"
            />
          )}
          
          {view === 'week' && (
            <WeekView 
              onDayClick={handleDayClick} 
              key="week-view"
            />
          )}
          
          {view === 'day' && (
            <DayView 
              onTimeClick={handleDayClick} 
              key="day-view"
            />
          )}
        </AnimatePresence>
      </div>
      
      {showForm && (
        <TodoForm 
          initialDate={selectedDate} 
          todoToEdit={todoToEdit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default Calendar; 