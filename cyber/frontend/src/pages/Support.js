import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CardMedia,
  useTheme,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SupportIcon from '@mui/icons-material/Support';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SupportCard = ({ title, description, icon, buttonText, to, image }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h5" component="h2" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Button
          component={RouterLink}
          to={to}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2 }}
          fullWidth
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

const Support = () => {
  const theme = useTheme();
  
  const supportServices = [
    {
      title: 'Counseling Services',
      description: 'Access professional counseling services specialized in supporting individuals and families affected by Sickle Cell Disease. Our experienced counselors provide confidential support tailored to your needs.',
      icon: <SupportIcon color="primary" sx={{ fontSize: 32 }} />,
      buttonText: 'Schedule Session',
      to: '/counseling',
      image: '/images/counseling.jpg',
    },
    {
      title: 'Support Groups',
      description: 'Join our community support groups to connect with others who understand your journey with Sickle Cell Disease. Share experiences, learn coping strategies, and build lasting relationships.',
      icon: <GroupsIcon color="primary" sx={{ fontSize: 32 }} />,
      buttonText: 'Join Group',
      to: '/groups',
      image: '/images/support-group.jpg',
    },
    {
      title: 'Educational Resources',
      description: 'Access comprehensive educational materials about Sickle Cell Disease, treatment options, and lifestyle management strategies. Stay informed with the latest research and developments.',
      icon: <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />,
      buttonText: 'Learn More',
      to: '/resources',
      image: '/images/education.jpg',
    },
    {
      title: 'Medical Support',
      description: 'Connect with healthcare providers specializing in Sickle Cell Disease. Get information about treatment options, pain management, and preventive care.',
      icon: <LocalHospitalIcon color="primary" sx={{ fontSize: 32 }} />,
      buttonText: 'Find Care',
      to: '/medical',
      image: '/images/medical.jpg',
    },
    {
      title: 'Online Community',
      description: 'Join our online community forum to connect with others, share experiences, and get support 24/7. Our moderated platform ensures a safe and supportive environment.',
      icon: <ChatIcon color="primary" sx={{ fontSize: 32 }} />,
      buttonText: 'Join Discussion',
      to: '/forum',
      image: '/images/community.jpg',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Support Services
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          >
            Comprehensive support for individuals and families affected by Sickle Cell Disease
          </Typography>
        </Box>

        {/* Support Services Grid */}
        <Grid container spacing={4}>
          {supportServices.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <SupportCard {...service} />
            </Grid>
          ))}
        </Grid>

        {/* Contact Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            mt: 8, 
            p: 4, 
            textAlign: 'center',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Need Immediate Support?
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Our support team is available 24/7 to help you
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            Contact Us Now
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Support;