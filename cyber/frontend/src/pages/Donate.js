import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '../services/api';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const DonationOption = ({ amount, description, icon, onSelect, selected }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        transition: 'all 0.3s ease',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={onSelect}
    >
      <CardContent sx={{ textAlign: 'center', height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          ${amount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const donationOptions = [
    {
      amount: 25,
      description: 'Provide educational materials for one patient',
      icon: <SchoolIcon fontSize="large" color="primary" />,
    },
    {
      amount: 50,
      description: 'Support medical supplies for treatment',
      icon: <LocalHospitalIcon fontSize="large" color="primary" />,
    },
    {
      amount: 100,
      description: 'Fund research initiatives',
      icon: <ScienceIcon fontSize="large" color="primary" />,
    },
    {
      amount: 250,
      description: 'Sponsor a patient\'s treatment',
      icon: <VolunteerActivismIcon fontSize="large" color="primary" />,
    },
  ];

  const handleDonate = async () => {
    try {
      setLoading(true);
      setError('');

      const amount = selectedAmount || parseFloat(customAmount);
      if (!amount || amount <= 0) {
        throw new Error('Please select or enter a valid donation amount');
      }

      const stripe = await stripePromise;
      const response = await api.post('/api/donations/create-payment-intent/', {
        amount: amount * 100,
      });

      const { clientSecret } = response.data;

      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret
      });
      
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <FavoriteIcon 
            sx={{ 
              fontSize: 60, 
              color: theme.palette.primary.main,
              mb: 2 
            }} 
          />
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
            Make a Difference Today
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}
          >
            Your donation helps us support patients with Sickle Cell Anemia through
            research, education, and direct patient care.
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

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 6 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {donationOptions.map((option) => (
              <Grid item xs={12} sm={6} md={3} key={option.amount}>
                <DonationOption
                  {...option}
                  selected={selectedAmount === option.amount}
                  onSelect={() => {
                    setSelectedAmount(option.amount);
                    setCustomAmount('');
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }}>
            <Chip label="OR" />
          </Divider>

          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom align="center">
              Custom Amount
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="Enter amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              InputProps={{
                startAdornment: '$',
              }}
              sx={{ mb: 4 }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleDonate}
              disabled={loading || (!selectedAmount && !customAmount)}
              sx={{
                py: 2,
                fontSize: '1.1rem',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                `Donate ${selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ''}`
              )}
            </Button>
          </Box>
        </Paper>

        {/* Benefits Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Secure Donation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All transactions are encrypted and secure
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Tax Deductible
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive a receipt for tax purposes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Direct Impact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                100% of donations go to patient care
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Questions about donating? Contact us at support@example.com
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Donate;