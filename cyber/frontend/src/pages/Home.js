import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import StatisticsSection from '../components/home/StatisticsSection';
import FeaturedContent from '../components/home/FeaturedContent';

const Home = () => {
  return (
    <Box>
      <HeroSection />
      <StatisticsSection />
      <FeaturedContent />
      
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Support Patients
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find resources and support for managing Sickle Cell Anemia.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/support" 
                  variant="contained" 
                  sx={{ mt: 2 }}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Join Our Community
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with others and share experiences in our forum.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/forum" 
                  variant="contained" 
                  sx={{ mt: 2 }}
                >
                  Visit Forum
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Make a Difference
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Support our cause through donations or volunteering.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/donate" 
                  variant="contained" 
                  sx={{ mt: 2 }}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
