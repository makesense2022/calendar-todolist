import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isSameDay } from 'date-fns';

// 添加Chrome API类型声明
declare global {
  interface Window {
    chrome?: {
      storage?: {
        local: {
          get: (keys: string[], callback: (result: any) => void) => void;
          set: (items: object, callback?: () => void) => void;
        }
      }
    }
  }
}

export type Todo = {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  isHistorical?: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, newTodo: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  getTodoById: (id: string) => Todo | undefined;
  loadTodos: () => void;
  saveTodos: () => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  
  loadTodos: async () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['todos'], (result) => {
          if (result.todos) {
            set({ todos: JSON.parse(result.todos) });
          }
        });
      } else {
        console.warn('Chrome存储API不可用，将使用内存存储');
      }
    } catch (error) {
      console.error('加载待办事项时出错:', error);
    }
  },
  
  saveTodos: async () => {
    try {
      const { todos } = get();
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ todos: JSON.stringify(todos) });
      } else {
        console.warn('Chrome存储API不可用，数据将不会被保存');
      }
    } catch (error) {
      console.error('保存待办事项时出错:', error);
    }
  },
  
  addTodo: (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now().toString(),
      completed: false,
    };
    set((state) => ({
      todos: [...state.todos, newTodo],
    }));
    get().saveTodos();
  },
  
  updateTodo: (id, newTodo) => {
    set((state) => ({
      todos: state.todos.map((todo) => 
        todo.id === id ? { ...todo, ...newTodo } : todo
      ),
    }));
    get().saveTodos();
  },
  
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
    get().saveTodos();
  },
  
  toggleCompleted: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
    get().saveTodos();
  },
  
  getTodoById: (id) => {
    return get().todos.find((todo) => todo.id === id);
  },
})); 