import React, { useEffect } from 'react';
import { Box, LinearProgress, useScrollTrigger, Fab, Zoom } from '@mui/material';
import { useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

// Scroll to top button component
const ScrollTop = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
      >
        <Fab
          onClick={handleClick}
          color="primary"
          size="small"
          aria-label="scroll back to top"
          sx={{
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

const Layout = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Loading indicator */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
          }}
        >
          <LinearProgress color="secondary" />
        </Box>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          backgroundColor: 'background.default',
          transition: 'padding 0.3s ease',
          pt: { xs: 2, sm: 3 },
          pb: { xs: 4, sm: 5 },
          px: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />

      {/* Scroll to top button */}
      <ScrollTop />

      {/* Optional: Add a background pattern or gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme => 
            `linear-gradient(45deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default Layout;
