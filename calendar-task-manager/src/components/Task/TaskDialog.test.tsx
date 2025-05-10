import { render, screen, fireEvent } from '@testing-library/react';
import { TaskDialog } from './TaskDialog';
import { TaskProvider } from '@/context/TaskContext';
import { Task } from '@/types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  color: '#FF6B6B',
  date: '2024-03-20',
  createdAt: '2024-03-20T00:00:00.000Z',
  order: 0,
};

describe('TaskDialog', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <TaskProvider>
        {ui}
      </TaskProvider>
    );
  };

  it('renders new task dialog correctly', () => {
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={() => {}}
        date="2024-03-20"
      />
    );

    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Recurrence')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders edit task dialog correctly', () => {
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={() => {}}
        date="2024-03-20"
        task={mockTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('handles form submission for new task', () => {
    const onClose = jest.fn();
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={onClose}
        date="2024-03-20"
      />
    );

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    fireEvent.change(titleInput, { target: { value: 'New Task' } });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('handles form submission for edit task', () => {
    const onClose = jest.fn();
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={onClose}
        date="2024-03-20"
        task={mockTask}
      />
    );

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('handles recurrence options correctly', async () => {
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={() => {}}
        date="2024-03-20"
      />
    );

    const recurrenceSelect = screen.getByLabelText('Recurrence');
    fireEvent.mouseDown(recurrenceSelect);

    const weeklyOption = screen.getByText('Weekly');
    fireEvent.click(weeklyOption);

    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Day of Week')).toBeInTheDocument();
  });

  it('disables submit button when required fields are empty', () => {
    renderWithProvider(
      <TaskDialog
        open={true}
        onClose={() => {}}
        date="2024-03-20"
      />
    );

    const createButton = screen.getByText('Create');
    expect(createButton).toBeDisabled();
  });
}); 