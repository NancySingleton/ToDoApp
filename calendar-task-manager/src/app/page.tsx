'use client';

import { Typography, Container } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h1" component="h1" gutterBottom>
        Calendar Task Manager
      </Typography>
      <Typography variant="body1">
        Welcome to your task management system
      </Typography>
    </Container>
  );
}
