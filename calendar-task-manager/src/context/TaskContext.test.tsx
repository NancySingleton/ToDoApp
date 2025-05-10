import { render, screen, fireEvent, act } from '@testing-library/react';
import { TaskProvider, useTasks } from './TaskContext';
import { Task, RecurrenceFrequency } from '@/types/task';

const TestComponent = () => {
  const { tasks, addTask, editTask, deleteTask, reorderTasks, getTasksForDate } = useTasks();

  return (
    <div>
      <div data-testid="tasks-count">{tasks.length}</div>
      <div data-testid="tasks-json">{JSON.stringify(tasks)}</div>
      <div data-testid="tasks-for-date-json">{JSON.stringify(getTasksForDate('2024-03-20'))}</div>
      <button onClick={() => addTask({
        title: 'New Task',
        color: '#FF6B6B',
        date: '2024-03-20',
      })}>
        Add Task
      </button>
      <button onClick={() => addTask({
        title: 'Recurring Task',
        color: '#96CEB4',
        date: '2024-03-20',
        recurrenceRule: {
          frequency: 'weekly',
          dayOfWeek: 3, // Wednesday
          endDate: '2024-04-20',
        },
      })}>
        Add Recurring Task
      </button>
      <button onClick={() => editTask('1', { title: 'Updated Task' })}>
        Edit Task
      </button>
      <button
        onClick={() => {
          if (tasks.length > 0) deleteTask(tasks[0].id);
        }}
      >
        Delete First Task
      </button>
      <button
        onClick={() => {
          if (tasks.length > 1) reorderTasks('2024-03-20', [tasks[1].id, tasks[0].id]);
        }}
      >
        Reorder Tasks
      </button>
      <button onClick={() => editTask('1', {
        title: 'Updated Title',
        color: '#45B7D1',
        date: '2024-03-21',
      })}>
        Edit Multiple Fields
      </button>
      <button onClick={() => addTask({
        title: 'Daily Task',
        color: '#FF6B6B',
        date: '2024-03-20',
        recurrenceRule: {
          frequency: 'daily',
          endDate: '2024-03-25',
        },
      })}>
        Add Daily Recurring Task
      </button>
      <div data-testid="tasks-for-date">
        {getTasksForDate('2024-03-20').length}
      </div>
      <div data-testid="recurring-tasks">
        {getTasksForDate('2024-03-27').length}
      </div>
      <div data-testid="future-tasks-json">{JSON.stringify(getTasksForDate('2024-03-21'))}</div>
    </div>
  );
};

describe('TaskContext', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <TaskProvider>
        {ui}
      </TaskProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-20'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('provides initial empty tasks list', () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('0');
  });

  it('adds a new task', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('adds a recurring task and generates instances', () => {
    renderWithProvider(<TestComponent />);
    
    // Add a recurring task
    fireEvent.click(screen.getByText('Add Recurring Task'));
    
    // Check that the task is added
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
    
    // Check that the recurring instance appears on the next occurrence
    expect(screen.getByTestId('recurring-tasks')).toHaveTextContent('1');
  });

  it('edits an existing task', () => {
    renderWithProvider(<TestComponent />);
    
    // Add a task first
    fireEvent.click(screen.getByText('Add Task'));
    
    // Then edit it
    fireEvent.click(screen.getByText('Edit Task'));
    
    // The task should still exist
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('deletes a task', () => {
    renderWithProvider(<TestComponent />);
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
    fireEvent.click(screen.getByText('Delete First Task'));
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('0');
  });

  it('reorders tasks', () => {
    renderWithProvider(<TestComponent />);
    
    // Add two tasks
    fireEvent.click(screen.getByText('Add Task'));
    fireEvent.click(screen.getByText('Add Task'));
    
    // Get the initial order
    const initialTasks = JSON.parse(screen.getByTestId('tasks-json').textContent || '[]');
    expect(initialTasks.length).toBe(2);
    
    // Reorder the tasks
    fireEvent.click(screen.getByText('Reorder Tasks'));
    
    // Get the tasks after reordering
    const reorderedTasks = JSON.parse(screen.getByTestId('tasks-json').textContent || '[]');
    expect(reorderedTasks.length).toBe(2);
    
    // Verify the order has changed
    expect(reorderedTasks[0].id).toBe(initialTasks[1].id);
    expect(reorderedTasks[1].id).toBe(initialTasks[0].id);
  });

  it('handles task updates with different fields', () => {
    renderWithProvider(<TestComponent />);
    // Add a task
    fireEvent.click(screen.getByText('Add Task'));
    // Edit multiple fields
    fireEvent.click(screen.getByText('Edit Multiple Fields'));
    // Check that the task still exists
    expect(screen.getByTestId('tasks-count')).toHaveTextContent('1');
  });

  it('handles recurring tasks with different frequencies', () => {
    renderWithProvider(<TestComponent />);
    
    // Add a daily recurring task
    fireEvent.click(screen.getByText('Add Daily Recurring Task'));
    
    // Check tasks for the initial date
    const tasksForDate = JSON.parse(screen.getByTestId('tasks-for-date-json').textContent || '[]');
    expect(tasksForDate.length).toBe(2);
    expect(tasksForDate.some((t: any) => t.isRecurrenceInstance === false)).toBe(true);
    expect(tasksForDate.some((t: any) => t.isRecurrenceInstance === true)).toBe(true);
    
    // Check tasks for a future date within the recurrence period
    const futureTasks = JSON.parse(screen.getByTestId('future-tasks-json').textContent || '[]');
    expect(futureTasks.length).toBe(1);
    expect(futureTasks[0].isRecurrenceInstance).toBe(true);
    expect(futureTasks[0].originalTaskId).toBeDefined();
  });

  it('throws error when useTasks is used outside TaskProvider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTasks must be used within a TaskProvider');

    console.error = consoleError;
  });
}); 