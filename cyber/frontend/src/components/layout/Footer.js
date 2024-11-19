import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com' },
    { icon: <TwitterIcon />, url: 'https://twitter.com' },
    { icon: <InstagramIcon />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We are dedicated to supporting individuals affected by Sickle Cell Disease
              through education, research, and community support.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  sx={{
                    mr: 1,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
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
                  color="text.secondary"
                  sx={{
                    textDecoration: 'none',
                    transition: 'color 0.2s, padding-left 0.2s',
                    '&:hover': {
                      color: 'primary.main',
                      paddingLeft: '8px',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  123 Health Street, Medical District
                  <br />
                  City, State 12345
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="primary" fontSize="small" />
                <Link
                  href="mailto:contact@sicklecellsupport.org"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  contact@sicklecellsupport.org
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="primary" fontSize="small" />
                <Link
                  href="tel:+15551234567"
                  color="text.secondary"
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  (555) 123-4567
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 6, mb: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
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
