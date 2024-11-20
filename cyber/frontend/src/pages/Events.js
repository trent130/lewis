import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Fade,
  useTheme,
  Tooltip,
} from '@mui/material';
import { format, isFuture, isPast } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/events/');
      setEvents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register/`);
      await fetchEvents();
      // You could add a success toast notification here
    } catch (err) {
      setError('Failed to register for event. Please try again.');
      console.error('Error registering for event:', err);
    }
  };

  const handleShare = (event) => {
    navigator.clipboard.writeText(window.location.href + `/${event.id}`);
    // You could add a success toast notification here
  };

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const eventDate = new Date(event.date);
      switch (filter) {
        case 'upcoming':
          return matchesSearch && isFuture(eventDate);
        case 'past':
          return matchesSearch && isPast(eventDate);
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Community Events
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          >
            Join us for educational seminars, support groups, and community gatherings
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 4 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['upcoming', 'past', 'all'].map((filterOption) => (
              <Chip
                key={filterOption}
                label={filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                onClick={() => setFilter(filterOption)}
                color={filter === filterOption ? 'primary' : 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Box>
        </Box>

        {/* Events Grid */}
        <Grid container spacing={4}>
          {filteredEvents.map((event) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <Fade in={true}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt={event.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
                      <Typography variant="body2">
                        {format(new Date(event.date), 'PPP')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
                      <Typography variant="body2">
                        {event.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PeopleIcon sx={{ mr: 1, fontSize: 'small', color: 'primary.main' }} />
                      <Typography variant="body2">
                        {event.available_spots} spots available
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedEvent(event)}
                        size="small"
                      >
                        Learn More
                      </Button>
                      <Box>
                        <Tooltip title="Share Event">
                          <IconButton
                            size="small"
                            onClick={() => handleShare(event)}
                            sx={{ mr: 1 }}
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {user && (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleRegister(event.id)}
                            disabled={event.is_registered || isPast(new Date(event.date))}
                          >
                            {event.is_registered ? 'Registered' : 'Register'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Event Details Dialog */}
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          maxWidth="md"
          fullWidth
          scroll="paper"
        >
          {selectedEvent && (
            <>
              <DialogTitle>
                <Typography variant="h5" component="div" fontWeight="bold">
                  {selectedEvent.title}
                </Typography>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: theme.shape.borderRadius,
                    }}
                  />
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedEvent.description}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Event Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {format(new Date(selectedEvent.date), 'PPP')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {format(new Date(selectedEvent.date), 'p')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {selectedEvent.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {selectedEvent.available_spots} spots available
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                {user && (
                  <Button
                    variant="contained"
                    onClick={() => handleRegister(selectedEvent.id)}
                    disabled={selectedEvent.is_registered || isPast(new Date(selectedEvent.date))}
                  >
                    {selectedEvent.is_registered ? 'Registered' : 'Register'}
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {filteredEvents.length === 0 && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm
                ? 'Try adjusting your search terms'
                : filter === 'upcoming'
                ? 'No upcoming events scheduled'
                : filter === 'past'
                ? 'No past events to display'
                : 'No events available'}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Events;