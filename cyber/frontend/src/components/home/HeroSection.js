import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = () => {
  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/images/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          gutterBottom
        >
          Fighting Sickle Cell Together
        </Typography>
        <Typography
          variant="h5"
          align="center"
          paragraph
          sx={{ mb: 4 }}
        >
          Join us in our mission to support those affected by Sickle Cell Anemia
          and work towards a better future.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/donate"
            variant="contained"
            color="secondary"
            size="large"
          >
            Donate Now
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            variant="outlined"
            color="inherit"
            size="large"
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
