import { render, screen, fireEvent } from '@testing-library/react';
import { Task } from './Task';
import { TaskWithRecurrence } from '@/types/task';

describe('Task', () => {
  const mockTask: TaskWithRecurrence = {
    id: '1',
    title: 'Test Task',
    color: '#FF6B6B',
    date: '2024-03-20',
    createdAt: new Date().toISOString(),
    order: 0,
    isRecurrenceInstance: false,
  };

  it('renders task correctly', () => {
    render(<Task task={mockTask} />);
    const taskElement = screen.getByText('Test Task').closest('div');
    expect(taskElement).toBeInTheDocument();
    expect(taskElement).toHaveStyle({
      backgroundColor: '#FF6B6B',
    });
  });

  it('handles click event', () => {
    const handleClick = jest.fn();
    render(<Task task={mockTask} onClick={handleClick} />);
    const taskElement = screen.getByText('Test Task').closest('div');
    fireEvent.click(taskElement!);
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows recurrence indicator for recurring tasks', () => {
    const recurringTask: TaskWithRecurrence = {
      ...mockTask,
      isRecurrenceInstance: true,
    };
    render(<Task task={recurringTask} />);
    const indicator = screen.getByTestId('recurrence-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({
      backgroundColor: '#fff',
    });
  });

  it('applies hover styles', () => {
    render(<Task task={mockTask} />);
    const taskElement = screen.getByText('Test Task').closest('div');
    fireEvent.mouseEnter(taskElement!);
    expect(taskElement).toHaveStyle({
      opacity: '0.8',
    });
  });

  it('truncates long titles', () => {
    const longTask: TaskWithRecurrence = {
      ...mockTask,
      title: 'This is a very long task title that should be truncated',
    };
    render(<Task task={longTask} />);
    const titleElement = screen.getByText('This is a very long task title that should be truncated');
    expect(titleElement).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  });
}); 