import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CalendarViewType } from '@/types/todo';
import { useViewStore } from '@/store/useViewStore';
import { useTodoStore } from '@/store/useTodoStore';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

// 定义样式对象
const styles = {
  header: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#4F46E5'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  todayButton: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#F3F4F6'
    }
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  navButton: {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#F3F4F6'
    }
  },
  navIcon: {
    width: '1rem',
    height: '1rem'
  },
  dateDisplay: {
    margin: '0 0.5rem',
    fontWeight: 500,
    minWidth: '120px',
    textAlign: 'center' as const
  },
  viewButtonsContainer: {
    display: 'flex',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  viewButton: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    color: '#000000',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    borderLeft: '' as string,
    borderRight: '' as string,
    borderTop: '' as string,
    borderBottom: '' as string,
  },
  viewButtonActive: {
    backgroundColor: '#4F46E5',
    color: 'white',
    borderColor: '#4F46E5'
  },
  viewButtonLeft: {
    borderRadius: '0.375rem 0 0 0.375rem',
    borderRight: '0px'
  },
  viewButtonMiddle: {
    borderRadius: 0,
    borderLeft: '0px',
    borderRight: '0px'
  },
  viewButtonRight: {
    borderRadius: '0 0.375rem 0.375rem 0',
    borderLeft: '0px'
  }
};

const ViewButtons = () => {
  const { view, setView } = useViewStore();

  // 创建按钮样式的函数，避免样式属性冲突
  const getButtonStyle = (buttonView: CalendarViewType['type']) => {
    // 基础样式
    let buttonStyle = { ...styles.viewButton };
    
    // 按钮位置样式
    if (buttonView === 'month') {
      buttonStyle = { 
        ...buttonStyle, 
        ...styles.viewButtonLeft,
        borderLeft: '1px solid #e5e7eb',  // 左边框
        borderRight: '0px',               // 无右边框
      };
    } else if (buttonView === 'week') {
      buttonStyle = { 
        ...buttonStyle, 
        ...styles.viewButtonMiddle,
        borderLeft: '0px',                // 无左边框
        borderRight: '0px',               // 无右边框
      };
    } else {
      buttonStyle = { 
        ...buttonStyle, 
        ...styles.viewButtonRight,
        borderLeft: '0px',                // 无左边框
        borderRight: '1px solid #e5e7eb', // 右边框
      };
    }
    
    // 激活状态样式
    if (view === buttonView) {
      buttonStyle = { 
        ...buttonStyle, 
        backgroundColor: '#4F46E5',
        color: 'white',
        borderTop: '1px solid #4F46E5',
        borderBottom: '1px solid #4F46E5',
      };
      
      // 为激活状态的边框设置正确的颜色
      if (buttonView === 'month') {
        buttonStyle.borderLeft = '1px solid #4F46E5';
      } else if (buttonView === 'day') {
        buttonStyle.borderRight = '1px solid #4F46E5';
      }
    }
    
    return buttonStyle;
  };

  return (
    <div style={styles.viewButtonsContainer}>
      <button
        style={getButtonStyle('month')}
        onClick={() => setView('month')}
      >
        月
      </button>
      <button
        style={getButtonStyle('week')}
        onClick={() => setView('week')}
      >
        周
      </button>
      <button
        style={getButtonStyle('day')}
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
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <FiCalendar style={styles.logo} />
        <h1 style={styles.title}>日历</h1>
      </div>
      
      <div style={styles.controlsContainer}>
        <button 
          style={styles.todayButton}
          onClick={resetToToday}
        >
          今天
        </button>
        
        <div style={styles.navContainer}>
          <button 
            style={styles.navButton}
            onClick={navigatePrevious}
          >
            <FiChevronLeft style={styles.navIcon} />
          </button>
          
          <span style={styles.dateDisplay}>
            {dateDisplay}
          </span>
          
          <button 
            style={styles.navButton}
            onClick={navigateNext}
          >
            <FiChevronRight style={styles.navIcon} />
          </button>
        </div>
        
        <ViewButtons />
      </div>
    </header>
  );
};

export default CalendarHeader; 