import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

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
export const login = (identifier, password) => {
  // Prevent function from being run on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/local`, { identifier, password }) // Corrected endpoint
      .then((res) => {
        // Set token response from Strapi for server validation
        // Cookie.set("token", res.data.jwt);
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
