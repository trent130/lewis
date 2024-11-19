import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Divider,
  useTheme,
  Fade,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeroSection from '../components/home/HeroSection';
import StatisticsSection from '../components/home/StatisticsSection';
import FeaturedContent from '../components/home/FeaturedContent';

const ActionCard = ({ title, description, icon, buttonText, to, image }) => {
  const theme = useTheme();
  
  return (
    <Fade in timeout={1000}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(to bottom, transparent 0%, ${theme.palette.background.paper} 100%)`,
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1, position: 'relative', pt: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              top: -28,
              left: 24,
              background: theme.palette.primary.main,
              borderRadius: '50%',
              p: 1,
              boxShadow: theme.shadows[4],
            }}
          >
            {icon}
          </Box>
          
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Button
            component={RouterLink}
            to={to}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            fullWidth
            sx={{
              mt: 'auto',
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};

const Home = () => {
  const theme = useTheme();

  const actionCards = [
    {
      title: 'Support Patients',
      description: 'Access resources, educational materials, and support services for managing Sickle Cell Anemia. Our community is here to help you every step of the way.',
      icon: <FavoriteIcon sx={{ fontSize: 32, color: 'white' }} />,
      buttonText: 'Find Support',
      to: '/support',
      image: '/images/support.jpg',
    },
    {
      title: 'Join Our Community',
      description: 'Connect with others, share experiences, and find support in our vibrant community forum. Together, we are stronger.',
      icon: <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />,
      buttonText: 'Join Forum',
      to: '/forum',
      image: '/images/community.jpg',
    },
    {
      title: 'Make a Difference',
      description: 'Support our mission through donations or volunteering. Your contribution helps us continue our work in supporting those affected by Sickle Cell Anemia.',
      icon: <VolunteerActivismIcon sx={{ fontSize: 32, color: 'white' }} />,
      buttonText: 'Donate Now',
      to: '/donate',
      image: '/images/donate.jpg',
    },
  ];

  return (
    <Box>
      <HeroSection />
      <StatisticsSection />
      <FeaturedContent />
      
      {/* Action Cards Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Get Involved
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 800, mx: 'auto' }}
            >
              Join our mission to support those affected by Sickle Cell Anemia
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {actionCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <ActionCard {...card} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join our community today and help us create positive change
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;