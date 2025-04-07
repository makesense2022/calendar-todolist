import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Priority, RepeatType } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay, format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  toggleCompleted: (id: string) => void;
  getTodosByDate: (date: Date) => Todo[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

// 处理重复任务
const handleRepeatingTodos = (todos: Todo[]): Todo[] => {
  const today = new Date();
  const repeatingTodos: Todo[] = [];
  
  todos.forEach(todo => {
    if (todo.repeat !== 'none') {
      const todoDate = parseISO(todo.date);
      
      // 如果原始任务日期已过，并且没有新生成的重复任务
      if (todoDate < today && !todos.some(t => 
        t.title === todo.title && 
        t.repeat === todo.repeat && 
        parseISO(t.date) >= today)) {
          
        let nextDate = todoDate;
        
        // 找到下一个符合条件的日期
        while (nextDate < today) {
          if (todo.repeat === 'daily') {
            nextDate = addDays(nextDate, 1);
          } else if (todo.repeat === 'weekly') {
            nextDate = addWeeks(nextDate, 1);
          } else if (todo.repeat === 'monthly') {
            nextDate = addMonths(nextDate, 1);
          }
        }
        
        // 创建新的重复任务
        const newTodo: Todo = {
          ...todo,
          id: uuidv4(),
          date: format(nextDate, 'yyyy-MM-dd'),
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        repeatingTodos.push(newTodo);
      }
    }
  });
  
  return [...todos, ...repeatingTodos];
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      currentDate: new Date(),
      
      setCurrentDate: (date: Date) => set({ currentDate: date }),
      
      addTodo: (todoData) => set(state => {
        const newTodo: Todo = {
          ...todoData,
          id: uuidv4(),
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { todos: [...state.todos, newTodo] };
      }),
      
      deleteTodo: (id: string) => set(state => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
      
      updateTodo: (id: string, todoData: Partial<Todo>) => set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id 
            ? { ...todo, ...todoData, updatedAt: new Date().toISOString() } 
            : todo
        )
      })),
      
      toggleCompleted: (id: string) => set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id 
            ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } 
            : todo
        )
      })),
      
      getTodosByDate: (date: Date) => {
        const processedTodos = handleRepeatingTodos(get().todos);
        return processedTodos.filter(todo => {
          const todoDate = parseISO(todo.date);
          return isSameDay(todoDate, date);
        });
      },
    }),
    {
      name: 'todo-storage',
    }
  )
); 