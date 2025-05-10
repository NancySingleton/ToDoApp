'use client';

import { useState } from 'react';
import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TaskList } from '../Task/TaskList';
import { TaskDialog } from '../Task/TaskDialog';
import { Task } from '@/types/task';
import { useTasks } from '@/context/TaskContext';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const { tasks } = useTasks();

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // JS Date.getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // We want: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday (Monday-first week)
  // So, if getDay() is 0 (Sunday), set to 6; otherwise, subtract 1
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedTask(undefined);
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setSelectedDate(task.date);
    }
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
    setSelectedTask(undefined);
  };

  const renderCalendarHeader = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {days.map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            {day}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date().toISOString().split('T')[0];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push(
        <Paper
          key={`empty-${i}`}
          role="gridcell"
          sx={{
            height: '100%',
            minHeight: 120,
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).toISOString().split('T')[0];

      const isToday = date === today;

      days.push(
        <Paper
          key={day}
          role="gridcell"
          sx={{
            height: '100%',
            minHeight: 120,
            p: 1,
            backgroundColor: isToday ? 'action.selected' : 'background.paper',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={() => handleDateClick(date)}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: isToday ? 'bold' : 'normal',
              mb: 1,
            }}
          >
            {day}
          </Typography>
          <TaskList date={date} onTaskClick={handleTaskClick} />
        </Paper>
      );
    }

    // Add trailing empty cells to always fill a 6-row (42-cell) grid
    while (days.length < 42) {
      days.push(
        <Paper
          key={`trailing-empty-${days.length}`}
          role="gridcell"
          sx={{
            height: '100%',
            minHeight: 120,
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    return days;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeft data-testid="ChevronLeftIcon" />
        </IconButton>
        <Typography variant="h6">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight data-testid="ChevronRightIcon" />
        </IconButton>
      </Box>

      {renderCalendarHeader()}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mt: 1 }}>
        {renderCalendarDays()}
      </Box>

      <TaskDialog
        open={!!selectedDate}
        onClose={handleCloseDialog}
        date={selectedDate || ''}
        task={selectedTask}
      />
    </Box>
  );
} 