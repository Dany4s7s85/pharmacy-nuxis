import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { ClipLoader } from 'react-spinners';
export default function CheckoutForm({ handleOrder, handleClose }) {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [iLoading, setILoading] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);
    const { error, ...rest } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (!error && rest.paymentIntent.status == 'succeeded') {
      handleOrder();
      handleClose();
      // dispatch(verifyStipePaymentIntent(values,function (res){
      setMessage('Success');
      setIsLoading(false);
      // }))

      return false;
    }
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occured.');
    }
    setIsLoading(false);
  };
  const handleLoad = () => {
    setILoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement onReady={handleLoad} id="payment-element" />

      {!iLoading && (
        <button
          className="sub-btn"
          disabled={isLoading || !stripe || !elements}
          id="submit"
        >
          <span id="button-text">
            {isLoading ? <ClipLoader size={25} color="white" /> : `Pay now`}
          </span>
        </button>
      )}
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
