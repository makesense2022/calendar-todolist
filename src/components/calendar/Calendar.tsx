import React from 'react';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import { useViewStore } from '@/store/useViewStore';

interface CalendarProps {
  onDayClick: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDayClick }) => {
  const { currentView } = useViewStore();

  return (
    <div className="h-full flex flex-col">
      <CalendarHeader />
      <div className="flex-1 overflow-auto mt-1">
        {currentView === 'month' && <MonthView onDayClick={onDayClick} />}
        {currentView === 'week' && <WeekView onDayClick={onDayClick} />}
        {currentView === 'day' && <DayView onDayClick={onDayClick} />}
      </div>
    </div>
  );
};

export default Calendar; 