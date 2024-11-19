import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Support = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Support Services
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Counseling
                </Typography>
                <Typography paragraph>
                  Access professional counseling services specialized in supporting
                  individuals and families affected by Sickle Cell Disease.
                </Typography>
                <Button component={RouterLink} to="/contact" variant="contained" color="primary">
                  Get Help
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Support Groups
                </Typography>
                <Typography paragraph>
                  Join our community support groups to connect with others who
                  understand your journey with Sickle Cell Disease.
                </Typography>
                <Button component={RouterLink} to="/groups" variant="contained" color="primary">
                  Join Group
                </Button> About page:


              </CardContent>

            </Card>
          </Grid>
          </Grid>

        </Box>
        </Container>
)}
export default Support;