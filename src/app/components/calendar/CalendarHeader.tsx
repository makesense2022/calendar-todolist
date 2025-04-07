import React from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { format, addMonths, subMonths } from 'date-fns';
import { useViewStore } from '@/store/useViewStore';
import { useDateStore } from '../../../store/useDateStore';
import { zhCN } from 'date-fns/locale';

interface CalendarHeaderProps {
  onClose?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onClose }) => {
  const { currentView, setCurrentView } = useViewStore();
  const { currentDate, setCurrentDate } = useDateStore();

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleViewChange = (newView: 'day' | 'week' | 'month') => {
    setCurrentView(newView);
  };

  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
        </h2>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="上个月"
          >
            <FiChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="下个月"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentView === 'day' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('day')}
          >
            日
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentView === 'week' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('week')}
          >
            周
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentView === 'month' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => handleViewChange('month')}
          >
            月
          </button>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="关闭"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </header>
  );
};

export default CalendarHeader; 