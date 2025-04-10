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
  onNewTask?: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onTodoClick, onNewTask }) => {
  const { currentView } = useViewStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [todoToEdit, setTodoToEdit] = useState<Todo | undefined>(undefined);
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setTodoToEdit(undefined);
    
    if (onNewTask) {
      onNewTask();
    } else {
      setShowForm(true);
    }
  };
  
  const handleTodoEdit = (todo: Todo) => {
    if (onTodoClick) {
      onTodoClick(todo);
    } else {
      setTodoToEdit(todo);
      setShowForm(true);
    }
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
          {currentView === 'month' && (
            <MonthView 
              onDayClick={handleDayClick} 
              key="month-view"
            />
          )}
          
          {currentView === 'week' && (
            <WeekView 
              onDayClick={handleDayClick} 
              key="week-view"
            />
          )}
          
          {currentView === 'day' && (
            <DayView 
              onTimeClick={handleDayClick} 
              key="day-view"
            />
          )}
        </AnimatePresence>
      </div>
      
      {showForm && !onTodoClick && (
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