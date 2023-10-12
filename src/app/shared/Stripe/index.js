import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import CircularProgress from '@mui/material/CircularProgress';

const stripePromise = loadStripe(`${process?.env?.REACT_APP_STRIPE_KEY}`);
export default function App({ handleOrder, handleClose }) {
  const dispatch = useDispatch();

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${process?.env?.REACT_APP_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm handleOrder={handleOrder} handleClose={handleClose} />
        </Elements>
      ) : (
        <CircularProgress sx={{ color: ' #235D5E' }} />
      )}
    </div>
  );
}
