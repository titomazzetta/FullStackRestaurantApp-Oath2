import { SessionProvider } from "next-auth/react";
import { AppProvider } from '../components/context'; // Your context provider

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
