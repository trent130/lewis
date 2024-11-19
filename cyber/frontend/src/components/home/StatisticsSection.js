import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const StatisticsSection = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Our Impact
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">1000+</Typography>
              <Typography variant="h6">Patients Supported</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">50+</Typography>
              <Typography variant="h6">Research Projects</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">100+</Typography>
              <Typography variant="h6">Community Events</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StatisticsSection;
