// _app.js
import { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { SessionProvider } from "next-auth/react";
import { AppProvider } from '../components/context';

const MyApp = ({ Component, pageProps }) => {
  const stripePromise = useMemo(() => loadStripe("your-publishable-key"), []);

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
