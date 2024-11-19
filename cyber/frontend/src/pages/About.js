import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          About Us
        </Typography>
        <Typography paragraph>
          The Sickle Cell Foundation is dedicated to improving the lives of individuals affected by sickle cell disease through advocacy, education, and support.
        </Typography>
        <Typography paragraph>
          Our mission is to promote awareness, advance research, and provide comprehensive support services to those living with sickle cell disease and their families.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
