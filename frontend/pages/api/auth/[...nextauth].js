import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = "http://127.0.0.1:1337"; // Use the IP address instead of 'localhost'

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
            return { email: res.data.user.email, name: res.data.user.username };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          throw new Error("Authorization error");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // This callback is called whenever a JWT is created (sign in) or updated
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // This callback is called whenever a session is checked
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },
  // Additional NextAuth configuration if needed
});
