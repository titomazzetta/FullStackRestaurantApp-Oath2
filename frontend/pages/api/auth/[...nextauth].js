import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = "http://127.0.0.1:1337"; // Add the protocol (http:// or https://)

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_URL}/api/auth/local`, {
            identifier: credentials.email,
            password: credentials.password,
            
          });

          if (res.data) {
            const user = res.data.user;
            // Attach the JWT from Strapi to the user object
            user.jwt = res.data.jwt;
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          throw new Error("Authorization error: " + error.message); // Provide more informative error messages
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Add necessary scopes here if needed
    }),
    // ... other providers if you have any
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === 'google') {
        try {
          // Include the Google access token in the request to Strapi
          const strapiRes = await axios.post(`${API_URL}/api/auth/google`, {
            email: user.email,
            username: user.name, // or any other user info you have
            access_token: account.access_token, // Include the Google access token here
          });

          if (strapiRes.data) {
            // Attach the JWT from Strapi to the NextAuth user object
            user.jwt = strapiRes.data.jwt;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Error during Strapi authentication:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // If user object exists and contains a JWT token, attach it to the JWT token
      if (user && user.jwt) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      // Include the JWT from Strapi in the NextAuth session object
      if (token.jwt) {
        session.jwt = token.jwt;
      }
      return session;
    },
  },
  // Additional NextAuth configuration if needed...
});
