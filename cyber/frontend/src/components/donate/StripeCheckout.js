import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, TextField, Box, Alert } from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: { name },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/donations/create-payment-intent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
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
        setError(data.error || 'An error occurred processing your donation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Box mb={2}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Donation Amount ($)"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          inputProps={{ min: "1", step: "0.01" }}
          fullWidth
          required
        />
      </Box>
      <Box mb={2}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!stripe || processing}
        fullWidth
      >
        {processing ? 'Processing...' : 'Donate Now'}
      </Button>
    </form>
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
