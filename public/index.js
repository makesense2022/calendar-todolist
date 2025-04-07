// 获取DOM元素
const currentTimeEl = document.getElementById('current-time');
const currentMonthEl = document.getElementById('current-month');
const calendarDaysEl = document.getElementById('calendar-days');
const todoListEl = document.getElementById('todo-list');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const addTodoBtn = document.getElementById('add-todo');
const todoFormModal = document.getElementById('todo-form-modal');
const todoForm = document.getElementById('todo-form');
const todoTitleInput = document.getElementById('todo-title');
const todoDateInput = document.getElementById('todo-date');
const todoPrioritySelect = document.getElementById('todo-priority');
const cancelTodoBtn = document.getElementById('cancel-todo');

// 日期状态
let currentDate = new Date();
let selectedDate = new Date();

// 初始化
function init() {
  // 检查DOM元素是否存在
  if (!currentTimeEl || !calendarDaysEl) {
    console.warn('必要的DOM元素不存在，可能在Next.js应用中运行');
    return; // 如果在Next.js应用中，不执行此脚本
  }

  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  renderCalendar();
  loadTodos();
  setupEventListeners();

  // 在控制台输出初始化成功信息，以便调试
  console.log('日历待办事项脚本初始化成功');
}

// 更新当前时间
function updateCurrentTime() {
  const now = new Date();
  currentTimeEl.textContent = now.toLocaleTimeString('zh-CN');
}

// 渲染日历
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 更新月份显示
  currentMonthEl.textContent = `${year}年${month + 1}月`;
  
  // 计算月初和月末
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 计算月初是星期几（0-6，0表示周日）
  const firstDayOfWeek = firstDay.getDay();
  
  // 日历总天数 = 月初星期几偏移 + 月总天数
  const daysInMonth = lastDay.getDate();
  
  // 清空日历
  calendarDaysEl.innerHTML = '';
  
  // 添加月初空白格
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day';
    calendarDaysEl.appendChild(emptyCell);
  }
  
  // 添加日期格子
  for (let day = 1; day <= daysInMonth; day++) {
    const dateCell = document.createElement('div');
    dateCell.className = 'calendar-day date-cell bg-gray-50 border rounded-md';
    
    // 当前日期高亮
    const currentDay = new Date();
    if (
      year === currentDay.getFullYear() &&
      month === currentDay.getMonth() &&
      day === currentDay.getDate()
    ) {
      dateCell.classList.add('bg-blue-100');
    }
    
    // 选中日期样式
    if (
      year === selectedDate.getFullYear() &&
      month === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    ) {
      dateCell.classList.add('ring-2', 'ring-blue-500');
    }
    
    // 日期数字
    const dateNumber = document.createElement('div');
    dateNumber.className = 'text-right font-medium';
    dateNumber.textContent = day;
    dateCell.appendChild(dateNumber);
    
    // 日期点击事件
    dateCell.addEventListener('click', () => {
      selectedDate = new Date(year, month, day);
      renderCalendar();
      renderTodosByDate(selectedDate);
    });
    
    calendarDaysEl.appendChild(dateCell);
  }
}

// 加载待办事项
function loadTodos() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['todos'], (result) => {
      if (result.todos) {
        renderTodosByDate(selectedDate, JSON.parse(result.todos));
      } else {
        renderTodosByDate(selectedDate, []);
      }
    });
  } else {
    // 开发环境下的fallback
    const mockTodos = [
      {
        id: '1',
        title: '示例任务',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        priority: 'medium'
      }
    ];
    renderTodosByDate(selectedDate, mockTodos);
  }
}

// 保存待办事项
function saveTodos(todos) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ todos: JSON.stringify(todos) });
  }
  renderTodosByDate(selectedDate, todos);
}

// 根据日期渲染待办事项
function renderTodosByDate(date, allTodos) {
  todoListEl.innerHTML = '';

  const todos = allTodos || [];
  const dateString = date.toISOString().split('T')[0];
  
  // 过滤当天的待办事项
  const todayTodos = todos.filter(todo => todo.date === dateString);
  
  if (todayTodos.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'text-gray-500 text-center py-4';
    emptyMsg.textContent = '当天没有待办事项';
    todoListEl.appendChild(emptyMsg);
  } else {
    // 按优先级排序
    todayTodos.sort((a, b) => {
      const priorityValue = { high: 3, medium: 2, low: 1 };
      return priorityValue[b.priority] - priorityValue[a.priority];
    });

    todayTodos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = `p-3 border-l-4 rounded shadow-sm ${todo.completed ? 'historical' : ''}`;
      todoItem.style.borderLeftColor = getPriorityColor(todo.priority);
      
      const todoTitle = document.createElement('div');
      todoTitle.className = 'font-medium';
      todoTitle.textContent = todo.title;
      todoItem.appendChild(todoTitle);
      
      const todoActions = document.createElement('div');
      todoActions.className = 'mt-2 flex justify-end gap-2';
      
      // 完成按钮
      const completeBtn = document.createElement('button');
      completeBtn.className = 'text-xs px-2 py-1 bg-green-100 text-green-700 rounded';
      completeBtn.textContent = todo.completed ? '取消完成' : '完成';
      completeBtn.addEventListener('click', () => {
        toggleTodoComplete(todo.id);
      });
      todoActions.appendChild(completeBtn);
      
      // 删除按钮
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'text-xs px-2 py-1 bg-red-100 text-red-700 rounded';
      deleteBtn.textContent = '删除';
      deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id);
      });
      todoActions.appendChild(deleteBtn);
      
      todoItem.appendChild(todoActions);
      todoListEl.appendChild(todoItem);
    });
  }
}

// 设置事件监听
function setupEventListeners() {
  // 确保元素存在
  if (!prevMonthBtn || !nextMonthBtn || !addTodoBtn || !cancelTodoBtn || !todoForm) {
    console.warn('无法设置事件监听，DOM元素不存在');
    return;
  }

  // 上个月
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  
  // 下个月
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  
  // 添加任务
  addTodoBtn.addEventListener('click', () => {
    todoDateInput.value = selectedDate.toISOString().split('T')[0];
    todoFormModal.classList.remove('hidden');
    console.log('点击添加任务按钮，打开表单');
  });
  
  // 取消添加
  cancelTodoBtn.addEventListener('click', () => {
    todoFormModal.classList.add('hidden');
    todoForm.reset();
  });
  
  // 提交表单
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('提交表单');
    addTodo();
  });

  // 添加日历中点击添加的事件处理
  document.querySelectorAll('.calendar-cell').forEach(cell => {
    cell.addEventListener('click', function(e) {
      if (e.target.classList.contains('hover:text-blue-400') || e.target.closest('.hover:text-blue-400')) {
        // 点击了"点击添加"文本
        const dateText = this.querySelector('.calendar-date').textContent;
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        selectedDate = new Date(year, month, parseInt(dateText));
        
        // 打开任务表单
        if (todoDateInput && todoFormModal) {
          todoDateInput.value = selectedDate.toISOString().split('T')[0];
          todoFormModal.classList.remove('hidden');
          console.log('点击日历中的添加，打开表单，日期:', selectedDate);
        }
      }
    });
  });
}

// 添加待办事项
function addTodo() {
  const title = todoTitleInput.value.trim();
  const date = todoDateInput.value;
  const priority = todoPrioritySelect.value;
  
  if (!title || !date) return;
  
  const newTodo = {
    id: Date.now().toString(),
    title,
    date,
    priority,
    completed: false
  };
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['todos'], (result) => {
      let todos = [];
      if (result.todos) {
        todos = JSON.parse(result.todos);
      }
      todos.push(newTodo);
      saveTodos(todos);
      todoFormModal.classList.add('hidden');
      todoForm.reset();
    });
  } else {
    // 开发环境fallback
    const mockTodos = [{
      id: '1',
      title: '示例任务',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      priority: 'medium'
    }, newTodo];
    saveTodos(mockTodos);
    todoFormModal.classList.add('hidden');
    todoForm.reset();
  }
}

// 切换待办事项完成状态
function toggleTodoComplete(todoId) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['todos'], (result) => {
      if (result.todos) {
        const todos = JSON.parse(result.todos);
        const updatedTodos = todos.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(updatedTodos);
      }
    });
  }
}

// 删除待办事项
function deleteTodo(todoId) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['todos'], (result) => {
      if (result.todos) {
        const todos = JSON.parse(result.todos);
        const updatedTodos = todos.filter(todo => todo.id !== todoId);
        saveTodos(updatedTodos);
      }
    });
  }
}

// 获取优先级颜色
function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#6b7280';
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(init, 500); // 延迟初始化，确保DOM已完全加载
}); 