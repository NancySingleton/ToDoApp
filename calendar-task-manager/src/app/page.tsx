'use client';

import { Container } from '@mui/material';
import { Calendar } from '@/components/Calendar/Calendar';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Calendar />
    </Container>
  );
}
