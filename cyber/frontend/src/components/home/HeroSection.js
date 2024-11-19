import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { keyframes } from '@mui/system';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("/images/hero-bg.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Parallax effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}80, ${theme.palette.secondary.dark}80)`,
          zIndex: 1,
        },
      }}
    >
      <Container 
        maxWidth="md" 
        sx={{ 
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          animation: `${fadeIn} 1s ease-out`
        }}
      >
        <Typography
          component="h1"
          variant="h1"
          sx={{
            color: 'white',
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            animation: `${fadeIn} 1s ease-out`,
            [theme.breakpoints.down('sm')]: {
              fontSize: '2rem',
            },
          }}
        >
          Fighting Sickle Cell Together
        </Typography>
        
        <Typography
          variant="h3"
          sx={{
            mb: 6,
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            animation: `${fadeIn} 1s ease-out 0.3s`,
            animationFillMode: 'backwards',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.25rem',
            },
          }}
        >
          Join us in our mission to support those affected by Sickle Cell Anemia
          and work towards a better future through research, care, and community.
        </Typography>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: `${fadeIn} 1s ease-out 0.6s`,
            animationFillMode: 'backwards',
          }}
        >
          <Button
            component={RouterLink}
            to="/donate"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              minWidth: 200,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            Donate Now
          </Button>
          
          <Button
            component={RouterLink}
            to="/about"
            variant="outlined"
            size="large"
            sx={{
              minWidth: 200,
              fontSize: '1.1rem',
              borderColor: 'white',
              color: 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
