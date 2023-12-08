import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import axios from "axios";

const API_URL = "http://127.0.0.1:1337"; // Add the protocol (http:// or https://)

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    
    

  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
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
          console.error("Error during Strapi authentication:", error);
          return false;
        }
      } else if (account.provider === "github") {
        try {
          // Include the necessary GitHub data in the request to Strapi
          const strapiRes = await axios.post(`${API_URL}/api/auth/github`, {
            access_token: account.access_token,
            // Include the necessary data from the GitHub account object
            // For example: email, username, etc.
          });

          if (strapiRes.data) {
            // Attach the JWT from Strapi to the NextAuth user object
            user.jwt = strapiRes.data.jwt;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error("Error during Strapi authentication:", error);
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
    // ... other callbacks if needed
  },
  // Additional NextAuth configuration if needed...
});
