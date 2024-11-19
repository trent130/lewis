import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  useTheme,
  Divider,
  Chip,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import ScienceIcon from '@mui/icons-material/Science';

const missionPoints = [
  {
    icon: <VolunteerActivismIcon fontSize="large" />,
    title: 'Support',
    description: 'Providing comprehensive support services and resources to individuals and families affected by sickle cell disease.',
  },
  {
    icon: <SchoolIcon fontSize="large" />,
    title: 'Education',
    description: 'Promoting awareness and understanding of sickle cell disease through educational programs and community outreach.',
  },
  {
    icon: <GroupsIcon fontSize="large" />,
    title: 'Advocacy',
    description: 'Advocating for better healthcare policies and increased research funding for sickle cell disease.',
  },
  {
    icon: <ScienceIcon fontSize="large" />,
    title: 'Research',
    description: 'Supporting and advancing research initiatives to improve treatments and find a cure for sickle cell disease.',
  },
];

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
          }}
        >
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
              mb: 4,
            }}
          >
            About Our Foundation
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mb: 6 }}
          >
            Dedicated to improving the lives of individuals affected by sickle cell disease through advocacy, education, and support.
          </Typography>
        </Box>

        {/* Mission Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {missionPoints.map((point, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {point.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {point.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {point.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

{/* Impact Section */}
<Paper 
  elevation={3} 
  sx={{ 
    p: 6,
    borderRadius: 2, 
    mb: 8,
    background: `linear-gradient(to right, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}15 100%)`,
  }}
>
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
      Our Impact
    </Typography>
    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
      Making a difference in the lives of those affected by Sickle Cell Disease
    </Typography>
  </Box>

  <Grid container spacing={4}>
    <Grid item xs={12} md={3}>
      <Box sx={{ 
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        }
      }}>
        <Typography 
          variant="h2" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          1,000+
        </Typography>
        <Typography variant="h6" gutterBottom>Families Supported</Typography>
        <Typography variant="body2" color="text.secondary">
          Providing comprehensive support through counseling, education, and resources
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={12} md={3}>
      <Box sx={{ 
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        }
      }}>
        <Typography 
          variant="h2" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          50+
        </Typography>
        <Typography variant="h6" gutterBottom>Research Projects</Typography>
        <Typography variant="body2" color="text.secondary">
          Advancing medical research and treatment options through collaborative studies
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={12} md={3}>
      <Box sx={{ 
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        }
      }}>
        <Typography 
          variant="h2" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          20+
        </Typography>
        <Typography variant="h6" gutterBottom>Years of Service</Typography>
        <Typography variant="body2" color="text.secondary">
          Two decades of dedicated service to the Sickle Cell community
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={12} md={3}>
      <Box sx={{ 
        textAlign: 'center',
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
        }
      }}>
        <Typography 
          variant="h2" 
          color="primary" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          100+
        </Typography>
        <Typography variant="h6" gutterBottom>Healthcare Partners</Typography>
        <Typography variant="body2" color="text.secondary">
          Collaborating with medical institutions worldwide
        </Typography>
      </Box>
    </Grid>
  </Grid>

  {/* Additional Impact Details */}
  <Box sx={{ mt: 6 }}>
    <Divider sx={{ mb: 4 }}>
      <Chip label="Key Achievements" color="primary" />
    </Divider>
    
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Educational Outreach
          </Typography>
          <Typography variant="body2" paragraph>
            • 500+ awareness workshops conducted
          </Typography>
          <Typography variant="body2" paragraph>
            • 10,000+ educational materials distributed
          </Typography>
          <Typography variant="body2">
            • 50+ schools partnered with
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Medical Support
          </Typography>
          <Typography variant="body2" paragraph>
            • $2M+ in medical assistance provided
          </Typography>
          <Typography variant="body2" paragraph>
            • 300+ medical professionals trained
          </Typography>
          <Typography variant="body2">
            • 30+ treatment centers supported
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Community Impact
          </Typography>
          <Typography variant="body2" paragraph>
            • 200+ community events organized
          </Typography>
          <Typography variant="body2" paragraph>
            • 5,000+ volunteer hours contributed
          </Typography>
          <Typography variant="body2">
            • 20+ policy initiatives supported
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
</Paper>

        {/* Vision Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              color: 'text.secondary',
            }}
          >
            We envision a world where sickle cell disease is well understood, effectively treated, and ultimately cured. Through our continued efforts in research, advocacy, and support, we strive to create a future where individuals with sickle cell disease can live healthy, fulfilling lives without limitations.
          </Typography>
        </Box>

        {/* Team Section */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Our Leadership
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Our dedicated team of healthcare professionals, researchers, and advocates works tirelessly to advance our mission and support the sickle cell community.
          </Typography>
          {/* Add team member cards here */}
        </Box>
      </Box>
    </Container>
  );
};

export default About;
