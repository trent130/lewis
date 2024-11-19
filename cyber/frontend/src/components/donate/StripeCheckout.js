import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Button,
  TextField,
  Box,
  Alert,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  InputAdornment,
  Chip,
  useTheme,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SUGGESTED_AMOUNTS = [10, 25, 50, 100];

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const theme = useTheme();

  const handleSuggestedAmount = (value) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: { name },
      });

      if (cardError) {
        throw new Error(cardError.message);
      }

      const response = await fetch('/api/donations/create-payment-intent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100),
          payment_method_id: paymentMethod.id,
          name: name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        setName('');
        setAmount('');
        elements.getElement(CardElement).clear();
      } else {
        throw new Error(data.error || 'An error occurred processing your donation');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
            mb: 2,
          }}
        >
          <FavoriteIcon sx={{ color: 'white', fontSize: 30 }} />
        </Box>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Make a Donation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your support helps us make a difference
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CreditCardIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Suggested Amounts
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SUGGESTED_AMOUNTS.map((value) => (
              <Chip
                key={value}
                label={`$${value}`}
                onClick={() => handleSuggestedAmount(value)}
                color={amount === value.toString() ? 'primary' : 'default'}
                sx={{ '&:hover': { cursor: 'pointer' } }}
              />
            ))}
          </Box>
        </Box>

        <TextField
          label="Donation Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          inputProps={{ min: "1", step: "0.01" }}
          fullWidth
          required
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Card Details
          </Typography>
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              p: 2,
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: theme.palette.text.primary,
                    '::placeholder': {
                      color: theme.palette.text.secondary,
                    },
                  },
                  invalid: {
                    color: theme.palette.error.main,
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!stripe || processing}
            size="large"
            startIcon={processing ? <CircularProgress size={20} /> : <LockIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
            }}
          >
            {processing ? 'Processing...' : `Donate ${amount ? `$${amount}` : 'Now'}`}
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Secure payment powered by Stripe
          </Typography>
        </Box>
      </form>
    </Paper>
  );
};

const StripeCheckout = ({ onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeCheckout;
