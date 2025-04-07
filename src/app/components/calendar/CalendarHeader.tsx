import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarViewType } from '@/types/todo';
import { useViewStore } from '@/store/useViewStore';
import { useTodoStore } from '@/store/useTodoStore';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ViewButtons = () => {
  const { view, setView } = useViewStore();

  return (
    <div className="flex border border-gray-300 rounded overflow-hidden">
      <button
        className={`px-3 py-1 text-sm ${
          view === 'month' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setView('month')}
      >
        月
      </button>
      <button
        className={`px-3 py-1 text-sm border-l border-r border-gray-300 ${
          view === 'week' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setView('week')}
      >
        周
      </button>
      <button
        className={`px-3 py-1 text-sm ${
          view === 'day' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setView('day')}
      >
        日
      </button>
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
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="border border-gray-300 rounded-md px-3 py-1 text-sm mr-3 bg-white hover:bg-gray-50"
            onClick={resetToToday}
          >
            今天
          </button>
          
          <div className="flex items-center">
            <button 
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={navigatePrevious}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="mx-3 text-base font-medium text-gray-800 min-w-[120px] text-center">
              {dateDisplay}
            </span>
            
            <button 
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={navigateNext}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <ViewButtons />
      </div>
    </div>
  );
};

export default CalendarHeader; 