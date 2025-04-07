import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Button } from '../Button';
import { CalendarViewType } from '@/types/todo';
import { useViewStore } from '@/store/useViewStore';
import { useTodoStore } from '@/store/useTodoStore';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

const ViewButtons = () => {
  const { view, setView } = useViewStore();

  return (
    <div className="flex rounded-md shadow-sm">
      <Button
        variant={view === 'month' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('month')}
        className="rounded-r-none"
      >
        月
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('week')}
        className="rounded-none border-l-0 border-r-0"
      >
        周
      </Button>
      <Button
        variant={view === 'day' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('day')}
        className="rounded-l-none"
      >
        日
      </Button>
    </div>
  );
};

const CalendarHeader = () => {
  const { view } = useViewStore();
  const { currentDate, setCurrentDate } = useTodoStore();

  const navigatePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  let dateDisplay = '';
  if (view === 'month') {
    dateDisplay = format(currentDate, 'yyyy年MM月', { locale: zhCN });
  } else if (view === 'week') {
    const weekStart = format(currentDate, 'MM月dd日', { locale: zhCN });
    dateDisplay = `${format(currentDate, 'yyyy年', { locale: zhCN })}${weekStart}的一周`;
  } else {
    dateDisplay = format(currentDate, 'yyyy年MM月dd日', { locale: zhCN });
  }

  return (
    <header className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <FiCalendar className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-semibold">日历</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetToToday}
          className="text-sm"
        >
          今天
        </Button>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={navigatePrevious}
            className="h-8 w-8"
          >
            <FiChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="mx-2 font-medium min-w-[120px] text-center">
            {dateDisplay}
          </span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={navigateNext}
            className="h-8 w-8"
          >
            <FiChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <ViewButtons />
      </div>
    </header>
  );
};

export default CalendarHeader; 