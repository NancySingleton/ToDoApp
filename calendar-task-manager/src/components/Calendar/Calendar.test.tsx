import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calendar } from './Calendar';
import { TaskProvider } from '@/context/TaskContext';
import { useTasks } from '@/context/TaskContext';

// Mock the useTasks hook
jest.mock('@/context/TaskContext', () => ({
  ...jest.requireActual('@/context/TaskContext'),
  useTasks: jest.fn(),
}));

describe('Calendar', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Test Task',
      date: '2024-03-15',
      color: '#FF6B6B',
      createdAt: '2024-03-15T00:00:00.000Z',
      order: 0,
    },
  ];

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <TaskProvider>
        {ui}
      </TaskProvider>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useTasks as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      addTask: jest.fn(),
      editTask: jest.fn(),
      deleteTask: jest.fn(),
      reorderTasks: jest.fn(),
      getTasksForDate: (date: string) => mockTasks.filter(task => task.date === date),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('displays the correct month and year', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    expect(screen.getByText('March 2024')).toBeInTheDocument();
  });

  it('displays all days of the week', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('displays the correct number of days for March 2024', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    
    // March 2024 has 31 days
    // We expect 42 cells (6 rows x 7 columns)
    expect(dayCells).toHaveLength(42);
    
    // Check that days 1-31 are present
    for (let i = 1; i <= 31; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('starts the month on the correct day', () => {
    // March 1, 2024 is a Friday
    jest.setSystemTime(new Date('2024-03-01'));
    renderWithProvider(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    // The first day of March 2024 is a Friday (index 4, Monday-first)
    // So the first day should be at index 4 (0-based, after 0-3 empty cells)
    expect(dayCells[4]).toHaveTextContent('1');
  });

  it('handles months with different numbers of days', () => {
    // Test February 2024 (leap year)
    jest.setSystemTime(new Date('2024-02-01'));
    renderWithProvider(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    // February 2024 has 29 days, but we always render 42 cells
    expect(dayCells).toHaveLength(42);
    // Check that days 1-29 are present
    for (let i = 1; i <= 29; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('renders the 1st of the month in the first column when the month starts on a Monday', () => {
    // April 1, 2024 is a Monday
    jest.setSystemTime(new Date('2024-04-01'));
    renderWithProvider(<Calendar />);

    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    // The first day should be at index 0 (Monday-first)
    expect(dayCells[0]).toHaveTextContent('1');
  });

  it('navigates to previous month when clicking previous button', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    // Find the previous button by its icon
    const prevButton = screen.getByTestId('ChevronLeftIcon').closest('button');
    fireEvent.click(prevButton!);
    
    expect(screen.getByText('February 2024')).toBeInTheDocument();
  });

  it('navigates to next month when clicking next button', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    // Find the next button by its icon
    const nextButton = screen.getByTestId('ChevronRightIcon').closest('button');
    fireEvent.click(nextButton!);
    
    expect(screen.getByText('April 2024')).toBeInTheDocument();
  });

  it('highlights today\'s date', () => {
    const today = new Date('2024-03-15');
    jest.setSystemTime(today);
    renderWithProvider(<Calendar />);
    
    const todayCell = screen.getByText('15').closest('[role="gridcell"]');
    expect(todayCell).toHaveStyle({ backgroundColor: 'action.selected' });
  });

  it('opens task dialog when clicking on a date', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    const dateCell = screen.getByText('15').closest('[role="gridcell"]');
    fireEvent.click(dateCell!);
    
    // Check if TaskDialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays tasks for the current date', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('opens task dialog with task details when clicking on a task', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    renderWithProvider(<Calendar />);
    
    const task = screen.getByText('Test Task');
    fireEvent.click(task);
    
    // Check if TaskDialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // Check if the task title is in the dialog
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
}); 