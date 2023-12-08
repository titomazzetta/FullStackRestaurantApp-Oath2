// _app.js
import { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SessionProvider } from "next-auth/react";
import { AppProvider } from '../components/context';

const MyApp = ({ Component, pageProps }) => {
  const stripePromise = useMemo(() => loadStripe("pk_test_51OAE6iIJv8uLOR3i4Jk7VywVJk52HujvL1z2Zk5MZXheNH2X5OZoqXQrylkMHJEKtB9TKllzjMqHEidhrHHObdcK00ZDmCokPv"), []);

  return (
    <SessionProvider session={pageProps.session}>
      <AppProvider>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
