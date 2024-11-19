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
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const DonationOption = ({ amount, description, onSelect, selected }) => (
  <Card 
    sx={{ 
      cursor: 'pointer',
      border: selected ? '2px solid #1976d2' : '1px solid #ddd',
    }}
    onClick={onSelect}
  >
    <CardContent>
      <Typography variant="h5" gutterBottom>
        ${amount}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationOptions = [
    { amount: 25, description: 'Provide educational materials for one patient' },
    { amount: 50, description: 'Support medical supplies for treatment' },
    { amount: 100, description: 'Fund research initiatives' },
    { amount: 250, description: 'Sponsor a patient\'s treatment' },
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
        amount: amount * 100, // Convert to cents
      });

      const { clientSecret } = response.data;

      // Redirect to Stripe Checkout instead of using Elements
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret
      });
      
      if (error) {
        throw new Error(error.message);
      }

      // Handle successful payment
      // You might want to redirect to a thank you page or show a success message
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Support Our Cause
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Your donation helps us support patients with Sickle Cell Anemia through
        research, education, and direct patient care.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {donationOptions.map((option) => (
          <Grid item xs={12} sm={6} key={option.amount}>
            <DonationOption
              amount={option.amount}
              description={option.description}
              selected={selectedAmount === option.amount}
              onSelect={() => {
                setSelectedAmount(option.amount);
                setCustomAmount('');
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
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
        />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleDonate}
          disabled={loading || (!selectedAmount && !customAmount)}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Donate ${selectedAmount ? `$${selectedAmount}` : customAmount ? `$${customAmount}` : ''}`
          )}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          All donations are tax-deductible. You will receive a receipt via email.
        </Typography>
      </Box>
    </Container>
  );
};

export default Donate;