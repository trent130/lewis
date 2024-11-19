import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box,
  Button,
  CardActions,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const resources = [
  {
    title: 'Understanding Sickle Cell',
    description: 'Learn about the basics of sickle cell disease, its causes, symptoms, and impact on daily life.',
    image: '/images/understanding.jpg', // Replace with actual image
    link: '/resources/understanding',
    color: '#e3f2fd' // light blue
  },
  {
    title: 'Treatment Options',
    description: 'Explore various treatment options, medications, and management strategies for sickle cell disease.',
    image: '/images/treatment.jpg', // Replace with actual image
    link: '/resources/treatment',
    color: '#f3e5f5' // light purple
  },
  {
    title: 'Support Network',
    description: 'Connect with our community, find support groups, and access valuable resources for patients and families.',
    image: '/images/support.jpg', // Replace with actual image
    link: '/resources/support',
    color: '#e8f5e9' // light green
  }
];

const FeaturedContent = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        py: 8,
        backgroundColor: 'background.default',
        borderRadius: '20px',
        my: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Featured Resources
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Discover comprehensive information and support for understanding and managing sickle cell disease.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {resources.map((resource, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                  },
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ position: 'relative', backgroundColor: resource.color }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={resource.image}
                    alt={resource.title}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main'
                    }}
                  >
                    {resource.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {resource.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={resource.link}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      textTransform: 'none',
                      '&:hover .MuiSvgIcon-root': {
                        transform: 'translateX(4px)',
                      },
                      '& .MuiSvgIcon-root': {
                        transition: 'transform 0.2s',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedContent;
