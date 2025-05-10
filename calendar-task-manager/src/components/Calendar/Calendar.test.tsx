import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  beforeEach(() => {
    // Reset the Date mock before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('displays the correct month and year', () => {
    // Set the date to March 15, 2024
    jest.setSystemTime(new Date('2024-03-15'));
    render(<Calendar />);
    expect(screen.getByText('March 2024')).toBeInTheDocument();
  });

  it('displays all days of the week', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    render(<Calendar />);
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dayNames.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('displays the correct number of days for March 2024', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    render(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    
    // March 2024 has 31 days
    // We expect 7 day headers + 4 empty cells + 31 days = 42 cells
    expect(dayCells).toHaveLength(42);
    
    // Check that days 1-31 are present
    for (let i = 1; i <= 31; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('starts the month on the correct day', () => {
    // March 1, 2024 is a Friday
    jest.setSystemTime(new Date('2024-03-01'));
    render(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    
    // The first day (1) should be in the 5th position (Friday)
    // We add 7 to account for the day headers
    expect(dayCells[7 + 4]).toHaveTextContent('1');
  });

  it('handles months with different numbers of days', () => {
    // Test February 2024 (leap year)
    jest.setSystemTime(new Date('2024-02-01'));
    render(<Calendar />);
    
    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');
    
    // February 2024 has 29 days
    // We expect 7 day headers + 3 empty cells + 29 days = 39 cells
    expect(dayCells).toHaveLength(39);
    
    // Check that days 1-29 are present
    for (let i = 1; i <= 29; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('renders the 1st of the month in the first column when the month starts on a Monday', () => {
    // April 1, 2024 is a Monday
    jest.setSystemTime(new Date('2024-04-01'));
    render(<Calendar />);

    // Get all day cells
    const dayCells = screen.getAllByRole('gridcell');

    // The first day (1) should be in the first column after the headers
    // Index 7 is the first cell after the 7 day headers
    expect(dayCells[7]).toHaveTextContent('1');
  });
}); 