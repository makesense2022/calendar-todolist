import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, Priority, RepeatType } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay, format, addDays, addWeeks, addMonths, parseISO } from 'date-fns';

interface TodoState {
  todos: Todo[];
  selectedTodoId: string | null;
  isFormOpen: boolean;
  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, todoData: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (id: string) => void;
  setSelectedTodoId: (id: string | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
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

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      selectedTodoId: null,
      isFormOpen: false,
      
      addTodo: (todoData) => {
        const now = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
        const newTodo: Todo = {
          id: uuidv4(),
          ...todoData,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },
      
      updateTodo: (id, todoData) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  ...todoData,
                  updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
                }
              : todo
          ),
        }));
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
          selectedTodoId: state.selectedTodoId === id ? null : state.selectedTodoId,
          isFormOpen: state.selectedTodoId === id ? false : state.isFormOpen,
        }));
      },
      
      toggleTodoCompletion: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
                }
              : todo
          ),
        }));
      },
      
      setSelectedTodoId: (id) => {
        set({ selectedTodoId: id });
      },
      
      setIsFormOpen: (isOpen) => {
        set({ isFormOpen: isOpen });
      },
    }),
    {
      name: 'todo-storage',
    }
  )
); 