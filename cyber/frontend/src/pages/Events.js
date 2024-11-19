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
} from '@mui/material';
import { format } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/events/');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/events/${eventId}/register/`);
      fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">
                    {format(new Date(event.date), 'PPP')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">
                    {event.location}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description.substring(0, 150)}...
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Learn More
                  </Button>
                  {user && (
                    <Button
                      variant="contained"
                      onClick={() => handleRegister(event.id)}
                      disabled={event.is_registered}
                    >
                      {event.is_registered ? 'Registered' : 'Register'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Event Details:
                </Typography>
                <Typography variant="body2">
                  Date: {format(new Date(selectedEvent.date), 'PPP')}
                </Typography>
                <Typography variant="body2">
                  Location: {selectedEvent.location}
                </Typography>
                <Typography variant="body2">
                  Available Spots: {selectedEvent.available_spots}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              {user && (
                <Button
                  variant="contained"
                  onClick={() => handleRegister(selectedEvent.id)}
                  disabled={selectedEvent.is_registered}
                >
                  {selectedEvent.is_registered ? 'Registered' : 'Register'}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Events;