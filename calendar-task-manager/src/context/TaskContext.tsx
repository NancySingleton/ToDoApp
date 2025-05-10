'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, TaskWithRecurrence, RecurrenceRule } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Task[];
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'order'> }
  | { type: 'EDIT_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'REORDER_TASKS'; payload: { date: string; taskIds: string[] } };

const initialState: TaskState = {
  tasks: [],
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        order: state.tasks.filter(t => t.date === action.payload.date).length,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'EDIT_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id),
      };
    }

    case 'REORDER_TASKS': {
      const { date, taskIds } = action.payload;
      const tasksForDate = state.tasks.filter(task => task.date === date);
      const otherTasks = state.tasks.filter(task => task.date !== date);

      const reorderedTasks = taskIds.map((id, index) => {
        const task = tasksForDate.find(t => t.id === id);
        if (!task) return null;
        return { ...task, order: index };
      }).filter((task): task is Task => task !== null);

      return {
        ...state,
        tasks: [...otherTasks, ...reorderedTasks],
      };
    }

    default:
      return state;
  }
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  editTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (date: string, taskIds: string[]) => void;
  getTasksForDate: (date: string) => TaskWithRecurrence[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'EDIT_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  };

  const reorderTasks = (date: string, taskIds: string[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: { date, taskIds } });
  };

  const getTasksForDate = (date: string): TaskWithRecurrence[] => {
    const dateObj = new Date(date);
    const tasks: TaskWithRecurrence[] = [];

    state.tasks.forEach(task => {
      // Add the original task if it's for this date
      if (task.date === date) {
        tasks.push({ ...task, isRecurrenceInstance: false });
      }

      // Handle recurring tasks
      if (task.recurrenceRule) {
        const rule = task.recurrenceRule;
        const endDate = new Date(rule.endDate);
        
        if (dateObj > endDate) return;

        const taskDate = new Date(task.date);
        let shouldAdd = false;

        switch (rule.frequency) {
          case 'daily':
            shouldAdd = true;
            break;

          case 'weekly':
            if (rule.dayOfWeek === dateObj.getDay()) {
              shouldAdd = true;
            }
            break;

          case 'monthly':
            const lastDayOfMonth = new Date(
              dateObj.getFullYear(),
              dateObj.getMonth() + 1,
              0
            ).getDate();
            const targetDay = Math.min(rule.dayOfMonth || 1, lastDayOfMonth);
            shouldAdd = dateObj.getDate() === targetDay;
            break;
        }

        if (shouldAdd) {
          tasks.push({
            ...task,
            date,
            isRecurrenceInstance: true,
            originalTaskId: task.id,
          });
        }
      }
    });

    // Sort by order
    return tasks.sort((a, b) => a.order - b.order);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        addTask,
        editTask,
        deleteTask,
        reorderTasks,
        getTasksForDate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
} 