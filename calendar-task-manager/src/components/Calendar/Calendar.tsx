'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

export function Calendar() {
  const [currentDate] = useState(new Date());
  
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </Typography>
      
      <Grid 
        container 
        spacing={1}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {/* Day headers */}
        {dayNames.map((day) => (
          <Grid key={day} role="gridcell">
            <Typography variant="subtitle2" align="center">
              {day}
            </Typography>
          </Grid>
        ))}

        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: firstDayAdjusted }).map((_, index) => (
          <Grid key={`empty-${index}`} role="gridcell">
            <Box sx={{ height: 100 }} />
          </Grid>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <Grid key={index + 1} role="gridcell">
            <Box
              sx={{
                height: 100,
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="body2">
                {index + 1}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
} 