'use client';

import { TaskWithRecurrence } from '@/types/task';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TaskProps {
  task: TaskWithRecurrence;
  onClick?: () => void;
}

const TaskPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8,
  },
}));

export function Task({ task, onClick }: TaskProps) {
  return (
    <TaskPaper
      elevation={1}
      sx={{
        backgroundColor: task.color,
        color: '#fff',
        position: 'relative',
      }}
      onClick={onClick}
    >
      <Typography variant="body2" noWrap>
        {task.title}
      </Typography>
      {task.isRecurrenceInstance && (
        <Box
          data-testid="recurrence-indicator"
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#fff',
          }}
        />
      )}
    </TaskPaper>
  );
} 