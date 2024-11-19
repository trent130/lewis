import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Fade,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Support', path: '/support' },
    { title: 'Donate', path: '/donate' },
    { title: 'Forum', path: '/forum' },
    { title: 'Events', path: '/events' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, color: 'primary.main' }}>
        Sickle Cell Foundation
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.title}
            component={RouterLink}
            to={item.path}
            selected={isCurrentPath(item.path)}
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Sickle Cell Foundation
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.title}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: 'white',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: isCurrentPath(item.path) ? '100%' : '0%',
                      height: '2px',
                      bottom: 0,
                      left: '0',
                      backgroundColor: 'white',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 2 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{
                    padding: 0.5,
                    border: 2,
                    borderColor: 'white',
                  }}
                >
                  <Avatar
                    sx={{ 
                      bgcolor: 'white',
                      color: 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {user?.firstName?.[0] || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  TransitionComponent={Fade}
                  sx={{ mt: 1 }}
                >
                  <MenuItem 
                    component={RouterLink} 
                    to="/dashboard"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography color="text.primary">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem 
                    component={RouterLink} 
                    to="/profile"
                    onClick={handleMenuClose}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography color="text.primary">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography color="text.primary">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    borderRadius: '20px',
                    px: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    borderRadius: '20px',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
