import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './TaskList';
import { useTasks } from '@/context/TaskContext';
import { Task } from '@/types/task';

jest.mock('@/context/TaskContext', () => ({
  ...jest.requireActual('@/context/TaskContext'),
  useTasks: jest.fn(),
}));

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    color: '#FF6B6B',
    date: '2024-03-20',
    createdAt: '2024-03-20T00:00:00.000Z',
    order: 0,
  },
  {
    id: '2',
    title: 'Task 2',
    color: '#4ECDC4',
    date: '2024-03-20',
    createdAt: '2024-03-20T00:00:00.000Z',
    order: 1,
  },
];

describe('TaskList', () => {
  beforeEach(() => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [],
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: () => [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty task list correctly', () => {
    render(<TaskList date="2024-03-20" />);
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('renders tasks correctly', () => {
    (useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: () => mockTasks,
    });
    render(<TaskList date="2024-03-20" />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('handles task click correctly', () => {
    const onTaskClick = jest.fn();
    (useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: () => mockTasks,
    });
    render(<TaskList date="2024-03-20" onTaskClick={onTaskClick} />);
    const task1 = screen.getByText('Task 1');
    fireEvent.click(task1);
    expect(onTaskClick).toHaveBeenCalledWith('1');
  });

  it('renders recurring tasks correctly', () => {
    const recurringTask: Task = {
      ...mockTasks[0],
      id: '3',
      recurrenceRule: {
        frequency: 'weekly',
        endDate: '2024-04-20',
        dayOfWeek: 3, // Wednesday
      },
    };
    (useTasks as jest.Mock).mockReturnValue({
      tasks: [recurringTask],
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: () => [recurringTask],
    });
    render(<TaskList date="2024-03-20" />);
    const taskElement = screen.getByText('Task 1');
    expect(taskElement).toBeInTheDocument();
    expect(taskElement.parentElement).toHaveStyle({ backgroundColor: '#FF6B6B' });
  });

  it('sorts tasks by order', () => {
    const tasks = [
      {
        ...mockTasks[0],
        order: 1,
      },
      {
        ...mockTasks[1],
        order: 0,
      },
    ];
    (useTasks as jest.Mock).mockReturnValue({
      tasks,
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: () => tasks.slice().sort((a, b) => a.order - b.order),
    });
    render(<TaskList date="2024-03-20" />);
    const taskElements = screen.getAllByText(/Task \d/);
    expect(taskElements[0]).toHaveTextContent('Task 2');
    expect(taskElements[1]).toHaveTextContent('Task 1');
  });
}); 