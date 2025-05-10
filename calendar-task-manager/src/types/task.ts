export type TaskColor =
  | '#FF6B6B'  // Red
  | '#4ECDC4'  // Teal
  | '#45B7D1'  // Blue
  | '#96CEB4'  // Green
  | '#FFEEAD'  // Yellow
  | '#D4A5A5'  // Pink
  | '#9B59B6'  // Purple
  | '#3498DB'; // Light Blue

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  endDate: string;
  dayOfWeek?: number;  // 0-6 for Sunday-Saturday
  dayOfMonth?: number; // 1-31
}

export interface Task {
  id: string;
  title: string;
  color: TaskColor;
  date: string;
  createdAt: string;
  recurrenceRule?: RecurrenceRule;
  order: number;
}

export interface TaskWithRecurrence extends Task {
  isRecurrenceInstance: boolean;
  originalTaskId?: string;
} 