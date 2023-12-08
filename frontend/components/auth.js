import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";
import { signIn } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// Register a new user
export const registerUser = (username, email, password) => {
  // Prevent function from being run on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/local/register`, { username, email, password })
      .then((res) => {
        // Set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);
        // Resolve the promise to set loading to false in SignUp form
        resolve(res);
        // Redirect back to home page for restaurant selection
        Router.push("/");
      })
      .catch((error) => {
        // Reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

// Login function
export const login = async (identifier, password) => {
  // Prevent function from being run on the server
  if (typeof window === "undefined") {
    return;
  }

  try {
    // First, try to login via Strapi and get the JWT
    const strapiRes = await axios.post(`${API_URL}/api/auth/local`, {
      identifier,
      password,
    });

    // Check if we got a JWT token back from Strapi
    if (strapiRes.data.jwt) {
      // Now initiate a NextAuth session with the JWT from Strapi
      const nextAuthRes = await signIn('credentials', {
        redirect: false, // Set redirect to false if you handle redirects manually
        // You'll need to send the JWT to your NextAuth credentials provider
        // Make sure to update your credentials provider to handle this token
        token: strapiRes.data.jwt,
      });

      // Check if NextAuth signIn was successful
      if (nextAuthRes.error) {
        // Handle errors, e.g., wrong credentials
        throw new Error(nextAuthRes.error);
      }

      // If everything is fine, you can handle post-login actions here
      // e.g., Router.push('/dashboard');
    } else {
      // Handle the case where Strapi does not return a JWT token
      throw new Error('No JWT token received from Strapi');
    }
  } catch (error) {
    // Handle errors from either Strapi login or NextAuth signIn
    console.error('Login error:', error);
    throw error; // Re-throw the error so that you can handle it in the component if needed
  }
};

// Logout function
export const logout = () => {
  Cookie.remove("token"); // Optional based on your setup
  signOut({ redirect: false });
  Router.push("/");
};
// Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// Not used in this tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Wrapper.getInitialProps = Component.getInitialProps;
  }

  return Wrapper;
};


export const googleLogin = (googleCode) => {
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/api/strapi-google-auth/user-profile`, { code: googleCode })
      .then((res) => {
        // Set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);
        // Resolve the promise to set loading to false in login form
        resolve(res);
        // Redirect back to home page after login
        Router.push("/");
      })
      .catch((error) => {
        // Reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};
