import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  Button,
  useTheme,
  Paper,
  TextField,
  Tooltip,
  Fade,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
  const theme = useTheme();
  const [email, setEmail] = React.useState('');

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Newsletter subscription logic here
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      {/* Newsletter Section */}
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Stay Updated
              </Typography>
              <Typography variant="body1">
                Subscribe to our newsletter for the latest updates and news.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  endIcon={<SendIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              We are dedicated to supporting individuals affected by Sickle Cell Disease through education, research, and community support.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social, index) => (
                <Tooltip
                  key={index}
                  title={social.label}
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mr: 1,
                      color: 'white',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'About', path: '/about' },
                { text: 'Events', path: '/events' },
                { text: 'Donate', path: '/donate' },
                { text: 'Forum', path: '/forum' },
                { text: 'Support', path: '/support' },
              ].map((link) => (
                <Link
                  key={link.text}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    opacity: 0.9,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      opacity: 1,
                      paddingLeft: '8px',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Health Street, Medical District
                  <br />
                  City, State 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Link
                  href="mailto:contact@sicklecellsupport.org"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  contact@sicklecellsupport.org
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Link
                  href="tel:+15551234567"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  (555) 123-4567
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<VolunteerActivismIcon />}
            component={RouterLink}
            to="/donate"
            sx={{
              mb: 3,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Support Our Cause
          </Button>

          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {'Copyright © '}
            <Link
              component={RouterLink}
              to="/"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': { opacity: 1 },
              }}
            >
              Sickle Cell Support
            </Link>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
