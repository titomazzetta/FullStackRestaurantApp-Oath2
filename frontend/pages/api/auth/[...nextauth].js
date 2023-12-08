import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = "http://127.0.0.1:1337";

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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${API_URL}/api/auth/local`, {
            identifier: credentials.username,
            password: credentials.password,
          });

          if (res.data) {
            return { ...res.data.user, jwt: res.data.jwt };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          throw new Error('Invalid credentials');
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "github") {
        const providerResponse = account.provider === "google"
          ? await axios.post(`${API_URL}/api/auth/google`, {
              email: user.email,
              username: user.name,
              access_token: account.access_token,
            })
          : await axios.post(`${API_URL}/api/auth/github`, {
              access_token: account.access_token,
            });

        if (providerResponse.data) {
          user.jwt = providerResponse.data.jwt;
          return true;
        } else {
          return false;
        }
      } else if (user.jwt) {
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user?.jwt) {
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.jwt) {
        session.jwt = token.jwt;
      }
      return session;
    },
  },
});
