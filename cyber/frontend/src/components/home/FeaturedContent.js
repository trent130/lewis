import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';

const FeaturedContent = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Featured Resources
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Resource"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Understanding Sickle Cell
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn about the basics of sickle cell disease and its impact.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Resource"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Treatment Options
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore various treatment options and management strategies.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image="/placeholder.jpg"
                alt="Resource"
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Support Network
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect with our community and support resources.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FeaturedContent;
