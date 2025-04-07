import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDateStore } from '@/store/useDateStore';
import { useViewStore } from '@/store/useViewStore';
import { ViewType } from '@/types/todo';

const CalendarHeader: React.FC = () => {
  const { currentDate, goToPrevMonth, goToNextMonth } = useDateStore();
  const { currentView, setCurrentView } = useViewStore();

  const handlePrevMonth = () => {
    goToPrevMonth();
  };

  const handleNextMonth = () => {
    goToNextMonth();
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">
          {format(currentDate, 'yyyy年M月', { locale: zhCN })}
        </h2>
        <div className="ml-4 flex space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex space-x-1 border rounded-md overflow-hidden">
        <button
          onClick={() => handleViewChange('day')}
          className={`px-3 py-1 text-sm ${
            currentView === 'day' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          日
        </button>
        <button
          onClick={() => handleViewChange('week')}
          className={`px-3 py-1 text-sm ${
            currentView === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          周
        </button>
        <button
          onClick={() => handleViewChange('month')}
          className={`px-3 py-1 text-sm ${
            currentView === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          月
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader; 