'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { Task, TaskColor, RecurrenceFrequency } from '@/types/task';
import { useTasks } from '@/context/TaskContext';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  date: string;
  task?: Task;
}

const taskColors: TaskColor[] = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B59B6', // Purple
  '#3498DB', // Light Blue
];

export function TaskDialog({ open, onClose, date, task }: TaskDialogProps) {
  const { addTask, editTask } = useTasks();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<TaskColor>(taskColors[0]);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency | ''>('');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(0);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setColor(task.color);
      if (task.recurrenceRule) {
        setRecurrenceFrequency(task.recurrenceRule.frequency);
        setRecurrenceEndDate(task.recurrenceRule.endDate);
        setDayOfWeek(task.recurrenceRule.dayOfWeek || 0);
        setDayOfMonth(task.recurrenceRule.dayOfMonth || 1);
      }
    } else {
      setTitle('');
      setColor(taskColors[0]);
      setRecurrenceFrequency('');
      setRecurrenceEndDate('');
      setDayOfWeek(0);
      setDayOfMonth(1);
    }
  }, [task]);

  const handleSubmit = () => {
    const taskData = {
      title,
      color,
      date: task?.date || date,
      recurrenceRule: recurrenceFrequency
        ? {
            frequency: recurrenceFrequency,
            endDate: recurrenceEndDate,
            ...(recurrenceFrequency === 'weekly' && { dayOfWeek }),
            ...(recurrenceFrequency === 'monthly' && { dayOfMonth }),
          }
        : undefined,
    };

    if (task) {
      editTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel id="color-select-label">Color</InputLabel>
            <Select
              labelId="color-select-label"
              value={color}
              label="Color"
              onChange={(e) => setColor(e.target.value as TaskColor)}
            >
              {taskColors.map((color) => (
                <MenuItem key={color} value={color}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: color,
                        borderRadius: 1,
                      }}
                    />
                    <Typography>{color}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="recurrence-select-label">Recurrence</InputLabel>
            <Select
              labelId="recurrence-select-label"
              value={recurrenceFrequency}
              label="Recurrence"
              onChange={(e) => setRecurrenceFrequency(e.target.value as RecurrenceFrequency | '')}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          {recurrenceFrequency && (
            <>
              <TextField
                label="End Date"
                type="date"
                value={recurrenceEndDate}
                onChange={(e) => setRecurrenceEndDate(e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />

              {recurrenceFrequency === 'weekly' && (
                <FormControl fullWidth>
                  <InputLabel id="day-of-week-label">Day of Week</InputLabel>
                  <Select
                    labelId="day-of-week-label"
                    value={dayOfWeek}
                    label="Day of Week"
                    onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  >
                    <MenuItem value={0}>Sunday</MenuItem>
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                  </Select>
                </FormControl>
              )}

              {recurrenceFrequency === 'monthly' && (
                <TextField
                  label="Day of Month"
                  type="number"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(Number(e.target.value))}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 31 }}
                />
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title || (recurrenceFrequency && !recurrenceEndDate)}
        >
          {task ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 